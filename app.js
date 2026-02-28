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
        const data = await fs.readFile("people.json", "utf-8")
        const peopleArray = JSON.parse(data)

        const searchName = readline.question("what the name ypu ant to search? ")

        const findName = peopleArray.find((person) => person.name.toLowerCase() === searchName.toLowerCase())

        if (findName) {
            console.log(findName)
        } else {
            console.log("person was not found")
        }
    } catch (error) {
        console.log("eroor: ", error.message)
    }
}


async function searchByAge(){
    try {
        const data = await fs.readFile("people.json", "utf-8")
        const peopleArray = JSON.parse(data)

        const searchAge = readline.question("what the age you want to search? ")

        const findAge = peopleArray.filter((person) => person.age == searchAge)

        if (findAge.length > 0) {
            console.log(findAge)
        }
    } catch (error) {
        console.log("eroor: ", error.message)
    }
}


async function dengerWords(text) {
    const dengerWords = ["death", "knife", "bomb", "attack"];
    let counter = 0
    const splitText = text.toLowerCase().split(" ")
    for (const word of splitText) {
        if (dengerWords.includes(word)){
            counter += 1;
        }
    }
    return counter
}

async function findDangerousPeople(){
    data = await fs.readFile("TRANSCRIPTIONS.JSON", "utf-8")
    theData = JSON.parse(data)
    const ageDangerMap = {}

    for (let i = 0; i < theData.length; i++) {

        const currntScore = await dengerWords(theData[i].content)
        const age = theData[i].age
        if (!ageDangerMap[age]) { 
            ageDangerMap[age] = []; 
        }
        ageDangerMap[age].push(currntScore)
    }
    
    const entries = Object.entries(ageDangerMap);

    const avarage = [];

    for (let i = 0; i < entries.length; i++) {
        entries[i]
    }
}

async function findDangerousPeople() {
    try {
        const transcriptionsData = JSON.parse(await fs.readFile("TRANSCRIPTIONS.json", "utf-8")); // [cite: 37]
        const peopleData = JSON.parse(await fs.readFile("people.json", "utf-8"));
        const ageDangerMap = {};

        for (const call of transcriptionsData) {
            const score = await dengerWords(call.content);
            if (score > 0) {
                if (!ageDangerMap[call.age]) {
                    ageDangerMap[call.age] = [];
                }
                ageDangerMap[call.age].push(score);
            }
        }

        const ageAverages = Object.entries(ageDangerMap).map(([age, scores]) => {
            const sum = scores.reduce((a, b) => a + b, 0);
            return {
                age: parseInt(age),
                average: sum / scores.length
            };
        });

        const top3Ages = ageAverages
            .sort((a, b) => b.average - a.average)
            .slice(0, 3)
            .map(item => item.age);

        console.log("The most dangerous ages are:", top3Ages);

    
        const dangerousPeople = peopleData.filter(person => top3Ages.includes(person.age));


        const reportResponse = await fetch(`${base_url}/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dangerousPeople)
        });

        const resultText = await reportResponse.text();
        console.log("Server Response:", resultText);
        console.log("Dangerous people found:", dangerousPeople.length);

    } catch (error) {
        console.log("Error in analysis: ", error.message);
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
            case '4':
                await searchByAge();
                break;
            case '5':
                await findDangerousPeople();
                break;
            case '0':
                console.log("exiting!")
                active = false;
                break;
            default:
                console.log("invalid option, try again");
                break;
        }
    }
}

menue()