import { deserializeEditor, serializeEditor } from "./levels";
import { addFile, listFiles, loadFile } from "./localStorage";
import { MenuItem, State } from "./world";

export function getMenuItem(): MenuItem[] {
    return [
        {
            name: "Back",
            onClick: (state) => { state.mode = { type: "editor", tile: "EMPTY" } }
        },
        {
            name: "Load",
            onClick: addLoadMenu
        },
        {
            name: "Save",
            onClick: addSaveMenu
        },
        {
            name: "Test",
            onClick: state=>{
                state.testing = true;
                state.mode = { type: "transition", direction:"down", progress:0, levelDelta:0 }
            }
        }
    ]
}

function addSaveMenu(state: State) {
    const files = listFiles();

    const items: MenuItem[] = [
        {
            name: "Back",
            onClick: state => state.menu.pop()
        },
        {
            name: "New File",
            onClick: state => {
                let n = window.prompt("Level Name");
                if (n) {
                    const content = serializeEditor(state);
                    console.log(content)
                    n = addFile(n, content);
                    state.editor.filename = n;
                    state.mode = { type: "editor", tile: "DOOR_CLOSED" }
                }
            }
        },
        ...files.map(f => {
            return {
                name: " " + f,
                onClick: state => {
                    const content = serializeEditor(state);
                    console.log(content)
                    state.editor.filename = addFile(f, content);
                    state.mode = { type: "editor", tile: "DOOR_CLOSED" }
                }
            }
        })
    ];

    const i = state.editor.filename ? files.indexOf(state.editor.filename) : -1;
    if(state.mode.type == "editMenu"){
        state.mode.selected = i > 0 ? i+ 2 : 1;
    } 

    state.menu.push(items);
}

function addLoadMenu(state: State) {
    const files = listFiles();

    const items: MenuItem[] = [
        {
            name: "Back",
            onClick: state => state.menu.pop()
        },
        ...files.map(f => {
            return {
                name: " " + f,
                onClick: state => {
                    const content = loadFile(f);
                    state.editor.filename = f;
                    if (content) {
                        // TODO else remove from file list
                        // TODO turn string to state
                        console.log("CONTENT", content);
                        deserializeEditor(content, state);
                        state.mode = { type: "editor", tile: "DOOR_CLOSED" }
                    }
                }
            }
        })
    ];

    state.menu.push(items);
}