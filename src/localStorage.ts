const KEY_NAMES = "PPATH-names";
const KEY_Prefix = "PPATH-level:"

export function listFiles(): string[] {
    let names = window.localStorage.getItem(KEY_NAMES);
    if (!names) {
        console.log("Adding names");
        names = "[]"
        window.localStorage.setItem(KEY_NAMES, names);
    }
    const arr = JSON.parse(names);
    if (Array.isArray(arr)) {
        return arr;
    }
    return [];
}

export function addFile(name: string, content: string): string {
    name = name.replace(/[^a-z0-9]+/gi, '_');
    const names = listFiles();
    if (names.indexOf(name) >= 0) {
        // duplicate
    } else {
        names.push(name);
        window.localStorage.setItem(KEY_NAMES, JSON.stringify(names));
    }

    window.localStorage.setItem(KEY_Prefix + name, content);
    return name;
}

export function loadFile(name: string): string | null {
    return window.localStorage.getItem(KEY_Prefix + name);
}