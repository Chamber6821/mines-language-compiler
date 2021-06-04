export default class TokenType {
    name: string
    regex: string

    constructor(name: string, regex: string) {
        this.name = name;
        this.regex = regex;
    }
}
