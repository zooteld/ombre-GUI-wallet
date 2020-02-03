//import { validateAddress } from "./address_tools"

export const payment_id = (input) => {
    return input.length === 0 || (/^[0-9A-Fa-f]+$/.test(input) && (input.length == 16 || input.length == 64))
}

export const privkey = (input) => {
    return input.length === 0 || (/^[0-9A-Fa-f]+$/.test(input) && input.length == 64)
}

export const address = (input) => {

    if(!(/^[0-9A-Za-z]+$/.test(input))) return false

    switch (input.substring(0,4)) {
        case "Shade":
        case "cash":
        case "Suto":
        case "Te":
            return input.length === 99

            return input.length == 98

        case "Suba":
        case "Ts":
            return input.length == 99

        case "Shadow":
        case "casi":
        case "Suti":
        case "Ti":
            return input.length === 110

        case "Shad3":
        case "Tu":
            return input.length === 55

        default:
            return false
    }
}
