import fs from 'fs/promises';
import readline from 'readline-sync';

const base_url = ("https://spiestestserver.onrender.com");

async function getPoepleList(){
    try {
        const people = await fetch(base_url + "/people")
        if (!people.ok) {
            throw new Error(`error: ${people.status}`)
        }
        const data = await people.text();

        await fs.writeFile("people.json", data);

        console.log(`${"people.json"} created succsesfully`)
    } catch (error) {
        console.log("eroor: ", error.message)
    }
}

getPoepleList()


async function getCallList(){
    try {
        const calls = await fetch(base_url + "/transcriptions")
        if (!calls.ok) {
            throw new Error(`error: ${calls.status}`)
        }
        const callsData = await calls.text();

        await fs.writeFile("TRANSCRIPTIONS.json", callsData);

        console.log(`${"TRANSCRIPTIONS.json"} created succsesfully`)
    } catch (error) {
        console.log("eroor: ", error.message)
    }
}

getCallList()


async function searchByName(){
    try {
        await fs.readFile("people.json");
    }
}




async function menue() {
    let active = true;

    while(active) {
        console.log("1. Get People List");
        console.log("2. Get Call Records");
        console.log("3. Search People by Name");
        console.log("4. Search People by Age");
        console.log("5. Find Dangerous People");
        console.log("0. Exit");
    }

    const choice = readline.question(" please select your choice: ")


    switch(choice) {
        case '1':
            await getPoepleList();
            break;
        case '2':
            await getCallList();
            break;
        case '3':
            await searchByName();
            break;
        case '0':
            console.log("exiting!")
            active = false;
            break;
        default:
            console.log("invalid option, try again");

    }
}

menue()