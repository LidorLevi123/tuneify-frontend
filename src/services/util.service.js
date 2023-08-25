import categoriesJson from '../data/categories.json' assert {type: 'json'}
import { FastAverageColor } from 'fast-average-color'

export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    debounce,
    randomPastTime,
    saveToStorage,
    loadFromStorage,
    getRandomColor,
    generateColors,
    getCategoriesJson,
    getAvgImgClr
}

function getCategoriesJson() {
    return categoriesJson
}

function makeId(length = 24) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateColors(hexColor) {

    // Convert the hex color to RGB format
    const r = parseInt(hexColor.substring(1, 3), 16)
    const g = parseInt(hexColor.substring(3, 5), 16)
    const b = parseInt(hexColor.substring(5, 7), 16)

    // Calculate the darker colors by reducing the RGB values by 23%
    const darkerR = Math.floor(r * 0.77)
    const darkerG = Math.floor(g * 0.77)
    const darkerB = Math.floor(b * 0.77)
    const darkerDarkerR = Math.floor(darkerR * 0.77)
    const darkerDarkerG = Math.floor(darkerG * 0.77)
    const darkerDarkerB = Math.floor(darkerB * 0.77)

    // Format the RGB values as hexadecimal color codes
    const darkerColor = "#" + _componentToHex(darkerR) + _componentToHex(darkerG) + _componentToHex(darkerB)
    const darkerDarkerColor = "#" + _componentToHex(darkerDarkerR) + _componentToHex(darkerDarkerG) + _componentToHex(darkerDarkerB)

    return [darkerColor, darkerDarkerColor]
}

function _componentToHex(c) {
    const hex = c.toString(16)
    return hex.length === 1 ? "0" + hex : hex
}


async function getAvgImgClr(imageRef) {
    try {
        const fac = new FastAverageColor()
        const { hex } = await fac.getColorAsync(imageRef)
        return hex
    } catch (err) {
        console.log(err)
        throw new Error('cant get average color')
    }

}



