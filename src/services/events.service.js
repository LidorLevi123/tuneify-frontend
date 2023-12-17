import { httpService } from "./http.service"

export const eventsService = {
    getEventsAndSocials
}

async function getEventsAndSocials(term) {
    try {
        const eventsAndSocials = await httpService.get('events/', term)
        return eventsAndSocials
    }
    catch (error) {
        console.log(error)
        throw new Error
    }
}
