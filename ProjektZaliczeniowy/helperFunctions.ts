
export const calculateRaceWinner = (carOne: any, usernameOne: string, carTwo: any, usernameTwo: string) : string => {
    console.log(carTwo)
    let statsOne: number = 0
    for (const value of Object.values(carOne.statistics.toObject())) {
        if(typeof value == 'number')
            statsOne += Number(value) 
    }

    let statsTwo: number = 0
    for (const value of Object.values(carTwo.statistics.toObject())) {
        if(typeof value == 'number')
            statsTwo += Number(value)        
    }

    const draw: boolean = statsOne == statsTwo
    let raceOutcome: string
    if(!draw) 
        raceOutcome = statsOne > statsTwo ? usernameOne : usernameTwo
    else 
        raceOutcome = 'draw'   

    return raceOutcome
}