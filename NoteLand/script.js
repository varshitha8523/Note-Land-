let rightdiv = document.querySelector('.right');
let two = document.querySelector('.two');
let rightContent = document.querySelector('.rightContent');
let middlediv = document.querySelector(".middle");
let formDiv;
let notesContent;
let horizontal;
let taskListHeading;
let notes = [];

// rendering notes and their tasks from localStorage
function renderElementsToScreen() {
    if (localStorage.getItem('notes')) {
        notes = JSON.parse(localStorage.getItem('notes'));
        notes.forEach(note => {
            renderToNoteList(note, note.unquieId);
        });
    }
}

// Event listener to create a new note
document.querySelector('#newNoteButtton').addEventListener('click', () => {
    // Remove existing content
    if (rightContent) rightContent.remove();
    if (formDiv) formDiv.remove();
    if (notesContent) notesContent.remove();

    // Creating form elements
    formDiv = document.createElement('div');
    formDiv.className = 'form';

    let cancelButton = document.createElement('img');
    let input = document.createElement('input');
    let textArea = document.createElement('textarea');
    let createButton = document.createElement('button');

    cancelButton.src = './assests/cancel.png';
    input.type = 'text';
    input.placeholder = 'NOTE TITLE';
    input.className = 'noteTitle';
    textArea.placeholder = 'NOTE DESCRIPTION';
    textArea.cols = '30';
    textArea.rows = '10';
    textArea.className = 'noteDescription';
    createButton.innerText = 'Create';
    createButton.className = 'createButton';

    formDiv.appendChild(cancelButton);
    formDiv.appendChild(input);
    formDiv.appendChild(textArea);
    formDiv.appendChild(createButton);
    rightdiv.appendChild(formDiv);

    // Event listener for cancel button
    cancelButton.addEventListener('click', () => {
        formDiv.remove();
        if (middlediv.childElementCount === 0) {
            rightdiv.appendChild(rightContent);
        }
    });

    // Event listener for create button
    createButton.addEventListener('click', () => {
        let unquieId = 'note' + Math.floor(Math.random() * 1000);
        let note = {
            title: input.value,
            content: textArea.value,
            tasks: [],  
            unquieId: unquieId
        };
        addNoteToLocalStorage(note);
        renderToNoteList(note, unquieId);
        input.value = '';
        textArea.value = '';
    });
});

//  rendering notes and tasks
function renderToNoteList(note, unquieId) {
    if (note.title.length > 0 && note.content.length > 0) {
        let div = document.createElement('div');
        div.classList.add('notes', unquieId);
        let h1 = document.createElement('h1');
        let p = document.createElement('p');

        h1.innerText = note.title;
        p.innerText = note.content;

        div.appendChild(h1);
        div.appendChild(p);
        middlediv.appendChild(div);
        if (middlediv.childElementCount >0) {
            rightContent.remove()
        }

        div.addEventListener('click', () => {
            if (formDiv) formDiv.remove();
            createNoteContent(note, unquieId, div);
        });
    } else {
        alert('Please enter the required fields');
    }
}
//creating note content
function createNoteContent(note, unquieId, div) {
    if (notesContent) notesContent.remove();
    if (rightContent) rightContent.remove();

    notesContent = document.createElement('div');
    notesContent.className = 'notescontent';

    let header = document.createElement('div');
    header.className = 'header';
    let h2 = document.createElement('h1');
    let buttons = document.createElement('div');
    buttons.className = 'buttons';
    let newTaskButton = document.createElement('button');
    newTaskButton.id = 'task';
    let deleteButton = document.createElement('button');
    deleteButton.id = 'delete';
    let contents = document.createElement('div');
    contents.className = 'contents';
    let paras = document.createElement('p');

    h2.innerText = note.title;
    newTaskButton.innerText = 'New Task';
    deleteButton.innerText = 'Delete Note';
    paras.innerText = note.content;

    buttons.appendChild(newTaskButton);
    buttons.appendChild(deleteButton);
    header.appendChild(h2);
    header.appendChild(buttons);
    contents.appendChild(paras);
    notesContent.appendChild(header);
    notesContent.appendChild(contents);
    rightdiv.appendChild(notesContent);

    // Rendering tasks if any there are any tasks
    renderTasks(contents, note.tasks);

   
    ensureTaskListHeading(contents, note.tasks);

    newTaskButtonclick(newTaskButton, contents, unquieId);
    deleteButtonclick(deleteButton, notesContent, div, unquieId);
}

function renderTasks(contents, tasks) {
    // Removing existing task list heading and horizontal line
    if (taskListHeading) taskListHeading.remove();
    if (horizontal) horizontal.remove();

    // Only adding heading if there are tasks existed
    if (tasks.length > 0) {
        taskListHeading = document.createElement('h1');
        taskListHeading.style.color = '#02549e';
        taskListHeading.textContent = 'TASKS LIST';
        contents.appendChild(taskListHeading);
    }

    // Separating completed and unchecked tasks
    let uncheckedTasks = tasks.filter(task => !task.completed);
    let completedTasks = tasks.filter(task => task.completed);

    // Rendering unchecked tasks
    uncheckedTasks.forEach(task => {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        let label = document.createElement('label');
        label.style.marginLeft = '0.5rem';
        let breaktag = document.createElement('br');
        label.innerText = task.taskName;

        contents.appendChild(checkbox);
        contents.appendChild(label);
        contents.appendChild(breaktag);

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                createBottomList(contents, checkbox, label, breaktag);
                updateTaskCompletionInLocalStorage(task.taskName, true, task.unquieId);
            } else {
                label.remove();
                checkbox.remove();
                breaktag.remove();
                updateTaskCompletionInLocalStorage(task.taskName, false, task.unquieId);
            }
        });
    });

    // Creating horizontal line if there are completed tasks
    if (completedTasks.length > 0) {
        if (!horizontal) {
            horizontal = document.createElement("hr");
            horizontal.className = "horizontal";
            contents.appendChild(horizontal);
        }

        // Render completed tasks below the horizontal line
        completedTasks.forEach(task => {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            let label = document.createElement('label');
            label.style.marginLeft = '0.5rem';
            let breaktag = document.createElement('br');
            label.innerText = task.taskName;

            createBottomList(contents, checkbox, label, breaktag);
        });
    }
}

//  handling new task button click
function newTaskButtonclick(newTaskButton, contents, unquieId) {
    newTaskButton.addEventListener('click', () => {
        let overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.display = "block";
        let taskDiv = document.createElement('div');
        taskDiv.className = 'taskDiv';
        let cancelButton2 = document.createElement('img');
        let input2 = document.createElement('input');
        input2.type = 'text';
        input2.placeholder = 'Task Name';
        let createTask = document.createElement('button');
        cancelButton2.src = './assests/cancel.png';
        createTask.innerText = 'Create Task';

        taskDiv.appendChild(cancelButton2);
        taskDiv.appendChild(input2);
        taskDiv.appendChild(createTask);
        overlay.appendChild(taskDiv);
        two.appendChild(overlay);

        cancelButton2.addEventListener('click', () => {
            overlay.remove();
        });

        createTask.addEventListener('click', () => {
            if (input2.value.length > 0) {
                overlay.style.display = 'none';
                addTaskToNoteAndUpdateLocalStorage(input2.value, contents, unquieId);
            } else {
                alert('Please Enter Task Name');
            }
        });
    });
}

function addTaskToNoteAndUpdateLocalStorage(taskName, contents, unquieId) {
    let note = notes.find(n => n.unquieId === unquieId);
    if (!note) return;

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = false;
    let label = document.createElement('label');
    label.style.marginLeft = '0.5rem';
    let breaktag = document.createElement('br');
    label.innerText = taskName;

    // Inserting the new tasks
    if (horizontal && contents.contains(horizontal)) {
        contents.insertBefore(checkbox, horizontal);
        contents.insertBefore(label, horizontal);
        contents.insertBefore(breaktag, horizontal);
    } else {
        contents.appendChild(checkbox);
        contents.appendChild(label);
        contents.appendChild(breaktag);
    }

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            createBottomList(contents, checkbox, label, breaktag);
            updateTaskCompletionInLocalStorage(taskName, true, unquieId);
        } else {
            label.remove();
            checkbox.remove();
            breaktag.remove();
            updateTaskCompletionInLocalStorage(taskName, false, unquieId);
        }
    });

    // Adding task to note and updating localStorage
    note.tasks.push({ taskName, completed: false, unquieId });
    localStorage.setItem('notes', JSON.stringify(notes));


    ensureTaskListHeading(contents, note.tasks);

    // Checking if any tasks are completed and appending <hr>  if required
    if (note.tasks.some(task => task.completed)) {
        appendHorizontalLine(contents);
    }
}

function appendHorizontalLine(contents) {
    // Removing any existing horizontal line 
    if (horizontal) {
        horizontal.remove();
    }
    // Creating and appending new horizontal line
    horizontal = document.createElement("hr");
    horizontal.className = "horizontal";
    
    // Appending <hr> before the first completed task or at the end if no completed tasks
    let firstCompletedTask = contents.querySelector('.img');
    if (firstCompletedTask) {
        contents.insertBefore(horizontal, firstCompletedTask);
    } else {
        contents.appendChild(horizontal);
    }
}

function createBottomList(contents, checkbox, label, breaktag) {

    checkbox.remove();
    label.remove();
    breaktag.remove();

    // Checking if horizontal line already exists; creating it if not
    appendHorizontalLine(contents);

    let image = document.createElement('img');
    image.className = 'img';
    image.src = "./assests/blue-checkmark.png";

    // Appending completed tasks after the horizontal line
    contents.appendChild(image);
    contents.appendChild(label);
    contents.appendChild(breaktag);
}

function ensureTaskListHeading(contents, tasks) {
    // Creating heading if there are tasks and it doesn't already exist
    if (tasks.length > 0 && !taskListHeading) {
        taskListHeading = document.createElement('h1');
        taskListHeading.style.color = '#02549e';
        taskListHeading.textContent = 'TASKS LIST';
    }

    // Appending heading if it's not already in the DOM and tasks are present
    if (tasks.length > 0 && taskListHeading) {
        if (!contents.contains(taskListHeading)) {
            let paras = contents.querySelector('p');
            if (paras) {
                // Inserting before `<hr>` if it exists, otherwise inserting before the paragraph
                if (horizontal && contents.contains(horizontal)) {
                    contents.insertBefore(taskListHeading, horizontal);
                } else {
                    contents.insertBefore(taskListHeading, paras.nextSibling);
                }
            } else {
                // If there are no paragraphs, appending the heading directly
                contents.appendChild(taskListHeading);
            }
        }
    }
}

//  handling delete button click
function deleteButtonclick(deleteButton, notesContent, div, unquieId) {
    deleteButton.addEventListener('click', () => {
        notesContent.remove();
        div.remove();
        if (middlediv.childElementCount === 0) {
            rightdiv.appendChild(rightContent);
        }
        notes = notes.filter(n => n.unquieId !== unquieId);
        localStorage.setItem('notes', JSON.stringify(notes));
    });
}

//  adding a note to localStorage
function addNoteToLocalStorage(note) {
    if (note.title.length > 0 && note.content.length > 0) {
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

// updating task completion status in localStorage
function updateTaskCompletionInLocalStorage(taskName, completed, unquieId) {
    let note = notes.find(n => n.unquieId === unquieId);
    if (note) {
        let task = note.tasks.find(t => t.taskName === taskName);
        if (task) {
            task.completed = completed;
            localStorage.setItem('notes', JSON.stringify(notes));
        }
    }
}

//  rendering of notes from localStorage
renderElementsToScreen();