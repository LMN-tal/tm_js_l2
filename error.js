export default class Error {
    constructor() {        
    }
    message(text) {        
        const errorMessage = document.getElementById('errors');
        const div = document.createElement("div");
        const textNode = document.createTextNode(text);
        div.appendChild(textNode);
        errorMessage.appendChild(div);
    }
}