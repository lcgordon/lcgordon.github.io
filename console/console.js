function START_WINDOW_CMD() {
    const CMD_CONSOLE = document.getElementById("cmd-body");
    console.log('attempting to start window...');
    let DIR = 'C:'                   // Current directory
    let THE_PROMPT = `username@lcgordon.github.io ~ %`
    let COMMAND = '';                // To store user input
    let CURSOR_POS = 0;    // track where the cursor is
    let HISTORY_POS = 0;
    let HISTORY_COMMAND = [];


    // Set initial prompt
    CMD_CONSOLE.innerHTML += `<span>${THE_PROMPT}</span>`;
    //CMD_CONSOLE.lastChild.innerText += `${THE_PROMPT}`;

    appendCursor()

    // Focus on div to capture keypresses
    CMD_CONSOLE.focus();

    // Handle keypresses
    CMD_CONSOLE.addEventListener('keydown', (event) => {
        let arrow_keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        removeCursor();

        if (event.key === 'Enter') {
            // Extract the user input
            const userInput = COMMAND.trim();
            if (COMMAND.length)
                HISTORY_COMMAND.push(COMMAND);
            console.log("User Input:", userInput);  // Do something with the input

            // THIS IS WHERE YOU DO YOUR COMMAND HANDLER
            command_handler(userInput);

            // Append the user input and move to the next line
            CMD_CONSOLE.innerHTML += `<br><span>${THE_PROMPT}</span>`;

            // Clear the current command
            COMMAND = '';  
            CURSOR_POS = 0;
            HISTORY_POS = HISTORY_COMMAND.length;
            event.preventDefault(); // Prevent default "Enter" behavior
        } 
        else if (event.key === 'Backspace') { // Handle backspace
            let flag = true;
            if (COMMAND.length <= 0 || CURSOR_POS <= 0)
                flag = false;
            
            if (flag) {
                COMMAND = COMMAND.slice(0, CURSOR_POS-1) +  COMMAND.slice(CURSOR_POS);
                CURSOR_POS--;
                CURSOR_POS = (CURSOR_POS <= 0) ? 0 : CURSOR_POS;
            }
        }
        else if (event.key === 'Delete') { // Handle backspace
            let flag = true;
            if (COMMAND.length <= 0 )
                flag = false;
            
            if (flag) {
                COMMAND = COMMAND.slice(0, CURSOR_POS) +  COMMAND.slice(CURSOR_POS+1);
                CURSOR_POS = (CURSOR_POS <= 0) ? 0 : CURSOR_POS;
            }
        }
        else if (event.key === 'Home') {
            event.preventDefault(); // Prevent the default action (whatever it is)
            CURSOR_POS = 0;
        }
        else if (event.key === 'End') {
            event.preventDefault(); // Prevent the default action (whatever it is)
            CURSOR_POS = COMMAND.length;
        }
        else if (event.key === 'Tab') { // will need to come back to this eventually
            event.preventDefault(); // Prevent the default action (scrolling)
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault(); // Prevent the default action (scrolling up)
            if (HISTORY_COMMAND.length == 0){
                appendCursor();
                return;
            }
            const inputLine = CMD_CONSOLE.querySelectorAll("span");
            HISTORY_POS--;
            HISTORY_POS = (HISTORY_POS < 0) ? 0 : HISTORY_POS;
            COMMAND = (HISTORY_COMMAND[HISTORY_POS]) ? HISTORY_COMMAND[HISTORY_POS] : '';
            CURSOR_POS = COMMAND.length;
            inputLine[inputLine.length - 1].innerText = `${THE_PROMPT}${COMMAND}`;
            appendCursor();
        }
        else if (event.key === 'ArrowDown') {
            event.preventDefault(); // Prevent the default action (scrolling down)
            if (HISTORY_POS === HISTORY_COMMAND.length - 1) {
                appendCursor();
                return;
            }
            const inputLine = CMD_CONSOLE.querySelectorAll("span");
            HISTORY_POS++;
            HISTORY_POS = (HISTORY_POS > HISTORY_COMMAND.length) ? (HISTORY_COMMAND.length) : HISTORY_POS;
            COMMAND = HISTORY_COMMAND[HISTORY_POS];
            if (typeof COMMAND !== 'undefined') {
                CURSOR_POS = COMMAND.length;
                inputLine[inputLine.length - 1].innerText = `${THE_PROMPT}${COMMAND}`;
            }
            else {
                CURSOR_POS = 0;
                COMMAND = '';
                inputLine[inputLine.length - 1].innerText = `${THE_PROMPT}`;
            }
            appendCursor();
        }
        else if (event.key === 'ArrowLeft') {
            if (COMMAND.length == 0) {
                appendCursor();
                return;
            }
            CURSOR_POS --;
            CURSOR_POS = (CURSOR_POS < 0) ? 0 : CURSOR_POS;
            if (CURSOR_POS >= 0)
                appendCursor('middle');
        }
        else if (event.key === 'ArrowRight') {
            CURSOR_POS ++;
            if (CURSOR_POS < COMMAND.length) 
                appendCursor('middle');
            else {
                CURSOR_POS = COMMAND.length;
                appendCursor();
            }
        }
        else if (event.key.length === 1) {
            // Capture typed characters
            if (CURSOR_POS == COMMAND.length){
                COMMAND += event.key;
            }
            else {
                COMMAND = COMMAND.slice(0, CURSOR_POS) + event.key + COMMAND.slice(CURSOR_POS);
            }
            CURSOR_POS ++;
        }
        if (!arrow_keys.includes(event.key)) { // Update the current input line
            const inputLine = CMD_CONSOLE.querySelectorAll("span");
            inputLine[inputLine.length - 1].innerText = `${THE_PROMPT}${COMMAND}`;
            if (CURSOR_POS == COMMAND.length)
                appendCursor();
            else
                appendCursor('middle');
        }
        CMD_CONSOLE.scrollTop = CMD_CONSOLE.scrollHeight; // scroll all the way down if any key is pressed
    });

    function appendCursor(pos='last') {
        const cmd_cursor = document.createElement('span');
        cmd_cursor.id = 'cmd-cursor';
        cmd_cursor.textContent = '_'; // Cursor character
        if (pos == 'last')
            CMD_CONSOLE.appendChild(cmd_cursor);
        else if (pos == 'middle') {
            const inputLine = CMD_CONSOLE.querySelectorAll("span");
            inputLine[inputLine.length - 1].innerHTML = `${THE_PROMPT}${COMMAND.slice(0, CURSOR_POS)}`;
            inputLine[inputLine.length - 1].innerHTML += `<u id="cmd-cursor-select">${COMMAND[CURSOR_POS]}</u>`;
            inputLine[inputLine.length - 1].innerHTML += `${COMMAND.slice(CURSOR_POS+1)}`;
        }
    }

    function removeCursor() {
        document.getElementById('cmd-cursor')?.remove();
        const cmd_cursor_select = document.getElementById('cmd-cursor-select');
        if (cmd_cursor_select) {
            CMD_CONSOLE.lastChild.innerHTML = `${THE_PROMPT}${COMMAND}`
            cmd_cursor_select.remove();
        }
    }

    function command_handler(command) {
        const command_components = command.split(" ").slice(1);
        const command_name = command.split(" ")[0];

        switch (command_name){
            case '':
                break;

            case '--help':
                handleHelp(command);
                break;

            case 'echo':
                handleEcho(command_components);
                break;

            case 'ls':
                handleLS(command);
                break;

            case 'pwd':
                handlePWD(command);
                break;

            default:
                CMD_CONSOLE.innerHTML += `<br><span>zsh: command not found: ${command.split(" ")[0]}</span>`;
                break;
        }
    }


    function handlePWD(command) {
        CMD_CONSOLE.innerHTML += `<br><span>/Users/lcgordon/</span>`;
    }

    function handleLS(command) {
        CMD_CONSOLE.innerHTML += `<br><span>movie_code.py</span>`;
    }

    function handleHelp(command) {
        CMD_CONSOLE.innerHTML += `<br><span>Welcome to the list of currently available commands:</span>`;
        CMD_CONSOLE.innerHTML += `<br>echo - display a line of text `;
        CMD_CONSOLE.innerHTML += `<br>ls - list directory contents `;
        CMD_CONSOLE.innerHTML += `<br>pwd - print name of current/working directory `;
        CMD_CONSOLE.innerHTML += `<br>Last updated: 6/20/25`;
    }

    function handleEcho(command_components) {
        CMD_CONSOLE.innerHTML += `<br><span>${command_components.join(" ")} </span>`;
    }
}

// Prevent the page from scrolling down when pressing spacebar inside the console window
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault(); 
    }
});

window.onload = function() {
    START_WINDOW_CMD();
}