
const { initial, maxBy } = require('lodash');
const v8 = require('v8');
const structuredClone = obj => {
    return v8.deserialize(v8.serialize(obj));
};
const { Worker } = require("worker_threads");

//add this script in myWorker.js file
const { parentPort, workerData } = require("worker_threads");
var tankCount = 0;
var healerCount = 0;
var meleeCount = 0;
var rangedCount = 0;
var optimalWeight = 0;
var raidSize = 0
var MaxIterations = 0
var InitialRoster = null;
var LoopingRosterSegamented = null;
var totalWeight = 0;
var LoopReturnRaids = []

parentPort.postMessage(processRaid(workerData.raidRoster, workerData.optimalWeight, workerData.tankCount, workerData.healerCount, workerData.rangedCount, workerData.meleeCount, workerData.raidSize))


function processRaid(_raidRoster, _optimalWeight, _tankCount, _healerCount, _rangedCount, _meleeCount, _raidSize) {
    InitialRoster = _raidRoster;
    LoopingRosterSegamented = structuredClone(InitialRoster)
    let initialRosterCount = InitialRoster.length;
    tankCount = _tankCount;
    healerCount = _healerCount;
    meleeCount = _meleeCount;
    rangedCount = _rangedCount;
    optimalWeight = _optimalWeight;
    raidSize = _raidSize;
    totalWeight = 0;

    if (raidSize == 10) {
        optimalWeight = (optimalWeight * .7)

    }

    for (let i = 0; i < raidSize; i++) {
        optimalWeight += 50;
    }
    parentPort.postMessage({ obj: "True Optimal Weight: " + optimalWeight, type: "log" })
    MaxIterations = Math.floor(initialRosterCount / raidSize)
    parentPort.postMessage({ obj: "Max Iterations: " + MaxIterations, type: "log" })


    let emptyRaid = {
        "weight": 0,
        "raid": null
    }

    LoopReturnRaids = [];
    let BestReturnRaids = [];

    for (let i = 0; i < MaxIterations; i++) {
        LoopReturnRaids[i] = structuredClone(emptyRaid)
        BestReturnRaids[i] = structuredClone(emptyRaid)
    }


    try {

        parentPort.postMessage({ obj: "Initial Raid Length: " + initialRosterCount, type: "log" })
        parentPort.postMessage({ obj: "Tank Count: " + tankCount, type: "log" })
        parentPort.postMessage({ obj: "Healer Count: " + healerCount, type: "log" })
        parentPort.postMessage({ obj: "Melee Count: " + meleeCount, type: "log" })
        parentPort.postMessage({ obj: "Ranged Count: " + rangedCount, type: "log" })

        //console.log(charArray)
        //console.log(charArray[11].primarySpec.role)
        let tankArray = InitialRoster.filter(e => { return e.primarySpec.role === "Tank" })
        if ((tankArray.length / tankCount) < MaxIterations) {
            MaxIterations = (tankArray.length / tankCount);
        }
        //console.log("tank araay: " + tankArray)
        //console.log("tank araay length: " + tankArray.length)
        let healerArray = InitialRoster.filter(e => { return e.primarySpec.role == 'Healer' })
        if ((healerArray.length / healerCount) < MaxIterations) {
            MaxIterations = (healerArray.length / healerCount);
        }
        //console.log("healer araay: " + healerArray)
        //console.log("healer araay length: " + healerArray.length)
        let rDPSArray = InitialRoster.filter(e => { return e.primarySpec.role == 'Ranged DPS' })
        //console.log("Ranged DPS araay: " + rDPSArray)
        //console.log("Ranged DPS araay length: " + rDPSArray.length)
        let mDPSArray = InitialRoster.filter(e => { return e.primarySpec.role == 'Melee DPS' })
        //console.log("Melee DPS araay: " + mDPSArray)
        //console.log("Melee DPS araay length: " + mDPSArray.length)

        if (tankArray.length < tankCount || healerArray.length < healerCount || rDPSArray.length < rangedCount || mDPSArray.length < meleeCount) {
            parentPort.postMessage({ obj: "No Valid Raid able to be formed based on roles", type: "log" })
            return 0
        }


        let tankPerm = combinations(tankArray, tankCount)
        parentPort.postMessage({ obj: "Tank Combinations: " + tankPerm.length, type: "log" })
        //console.log("Tank Combinations: " + tankPerm.length)
        let healerPerm = combinations(healerArray, healerCount)
        parentPort.postMessage({ obj: "Healer Combinations: " + healerPerm.length, type: "log" })
        //console.log("Healer Combinations: " + healerPerm.length)
        let rDPSPerm = combinations(rDPSArray, rangedCount)
        parentPort.postMessage({ obj: "Ranged DPS Combinations: " + rDPSPerm.length, type: "log" })
        //console.log("Ranged DPS Combinations: " + rDPSPerm.length)
        let mDPSPerm = combinations(mDPSArray, meleeCount)
        parentPort.postMessage({ obj: "Melee DPS Combinations: " + mDPSPerm.length, type: "log" })
        //console.log("Melee DPS Combinations: " + mDPSPerm.length)

        parentPort.postMessage({ obj: "Trying Cleans", type: "log" })
        tankPerm = CleanPerms(tankPerm)
        shuffle(tankPerm)
        healerPerm = CleanPerms(healerPerm)
        shuffle(healerPerm)
        rDPSPerm = CleanPerms(rDPSPerm)
        shuffle(rDPSPerm)
        mDPSPerm = CleanPerms(mDPSPerm)
        shuffle(mDPSPerm)
        parentPort.postMessage({ obj: "Finished Cleans", type: "log" })

        parentPort.postMessage({ obj: "Tank Combinations (Post Clean): " + tankPerm.length, type: "log" })
        parentPort.postMessage({ obj: "Healer Combinations (Post Clean): " + healerPerm.length, type: "log" })
        parentPort.postMessage({ obj: "Ranged DPS Combinations (Post Clean): " + rDPSPerm.length, type: "log" })
        parentPort.postMessage({ obj: "Melee DPS Combinations (Post Clean): " + mDPSPerm.length, type: "log" })

        //let bigAssArray = getCombinedTest(tankPerm, healerPerm, rDPSPerm, mDPSPerm)

        let bigAssArray = getCombined(tankPerm, healerPerm, rDPSPerm, mDPSPerm)




        parentPort.postMessage({ obj: "Big Ass Array" + bigAssArray.length, type: "log" })

        for (let i = 0; i < bigAssArray[0].length; i++) {
            let raidGroup = []
            raidGroup.push(...bigAssArray[0][i])
            if (isRaidValid(raidGroup)) {
                for (let q = 0; q < bigAssArray[1].length; q++) {
                    bigAssArray[1][q].forEach(item => {
                        raidGroup.push(item)
                    })
                    if (isRaidValid(raidGroup)) {
                        for (let j = 0; j < bigAssArray[2].length; j++) {
                            bigAssArray[2][j].forEach(item => {
                                raidGroup.push(item)
                            })
                            if (isRaidValid(raidGroup)) {
                                for (let k = 0; k < (bigAssArray[3][k].length) / 2; k++) {
                                    bigAssArray[3][k].forEach(item => {
                                        raidGroup.push(item)
                                    })
                                    if (isRaidValid(raidGroup)) {
                                        raidWeight = evaluateRaid(raidGroup)

                                        if (raidWeight > (optimalWeight - (optimalWeight * .2))) {
                                            //parentPort.postMessage({ obj: "Found Optimal Raid", type: "log" })
                                            //parentPort.postMessage({ obj: "ExtraRaid Length: " + (initialRosterCount - d.length), type: "log" })

                                            LoopReturnRaids[0].weight = raidWeight
                                            LoopReturnRaids[0].raid = structuredClone(raidGroup)

                                            LoopingRosterSegamented = InitialRoster
                                            recurseProc(1)

                                            //check to see if ALL values are better than previous Loop
                                            let ReplaceInBestRaid = false
                                            let ReplaceCount = 0;
                                            for (let i = 0; i < MaxIterations; i++) {
                                                ReplaceCount = ReplaceCount + LoopReturnRaids[i].weight;
                                            }


                                            if (ReplaceCount > totalWeight) {
                                                // parentPort.postMessage({ obj: "Replace Count:"+ReplaceCount, type: "log" })
                                                // parentPort.postMessage({ obj: "Ttoal WEight:"+ totalWeight, type: "log" })
                                                ReplaceInBestRaid = true;
                                            }

                                            //replace the best iteration so far with new loop values
                                            if (ReplaceInBestRaid) {
                                                totalWeight = 0;
                                                for (let i = 0; i < MaxIterations; i++) {
                                                    totalWeight = totalWeight + LoopReturnRaids[i].weight;
                                                    BestReturnRaids[i] = structuredClone(LoopReturnRaids[i]);
                                                    parentPort.postMessage({ obj: "BestRaid[" + i + "] Weight:  " + BestReturnRaids[i].weight, type: "log" })
                                                }
                                            }

                                            //see if we have all valid 2700+ raids
                                            let FinalCheck = true
                                            for (let i = 0; i < MaxIterations; i++) {
                                                if (BestReturnRaids[i].weight < (optimalWeight - (optimalWeight * .2))) {
                                                    FinalCheck = false
                                                }
                                            }
                                            if (FinalCheck) {
                                                parentPort.postMessage({ obj: BestReturnRaids, type: "obj" })
                                                return 0;
                                            }
                                            for (let i = 0; i < MaxIterations; i++) {
                                                LoopReturnRaids[i] = structuredClone(emptyRaid)

                                            }
                                        }
                                        for (let i = 0; i < MaxIterations; i++) {
                                            LoopReturnRaids[i] = structuredClone(emptyRaid)
                                        }
                                        let elementsToDeleteMeleeTwo = meleeCount
                                        while (elementsToDeleteMeleeTwo--) {
                                            raidGroup.pop()
                                        }
                                        //parentPort.postMessage({ obj: "raidgroup length:  " + raidGroup.length, type: "log" })
                                    } else {
                                        let elementsToDeleteMelee = meleeCount
                                        while (elementsToDeleteMelee--) {
                                            raidGroup.pop()
                                        }
                                    }
                                }
                                let elementsToDeleteRangedTwo = rangedCount
                                while (elementsToDeleteRangedTwo--) {
                                    raidGroup.pop()
                                }
                            } else {
                                let elementsToDeleteRanged = rangedCount
                                while (elementsToDeleteRanged--) {
                                    raidGroup.pop()
                                }
                            }
                        }
                        let elementsToDeleteHealerTwo = healerCount
                        while (elementsToDeleteHealerTwo--) {
                            raidGroup.pop()
                        }
                    } else {
                        let elementsToDeleteHealer = healerCount
                        while (elementsToDeleteHealer--) {
                            raidGroup.pop()
                        }
                    }

                }
                raidGroup = raidGroup.splice(0)
            } else {
                raidGroup = raidGroup.splice(0)
            }
        }
        parentPort.postMessage({ obj: "Ending Raid Loop. Returning", type: "log" })

        if (BestReturnRaids[0].weight > 0) {
            parentPort.postMessage({ obj: BestReturnRaids, type: "obj" })
        }

        return 0;

    } catch (error) {
        parentPort.postMessage({ obj: "********************************************", type: "log" })
        parentPort.postMessage({ obj: error, type: "log" })
        parentPort.postMessage({ obj: error.message, type: "log" })
        parentPort.postMessage({ obj: "********************************************", type: "log" })
    }
}


function recurseProc(iteration) {
    // parentPort.postMessage({ obj: "Recurse: " + iteration.toString(), type: "log" })
    if (iteration == MaxIterations) {
        return;
    }
    let interimArray = removeForSubsequentAssignment(LoopReturnRaids[iteration - 1].raid, LoopingRosterSegamented)
    //parentPort.postMessage({ obj: "Int Array Length: " + interimArray.length, type: "log" })
    if (processTertiaryRaid(interimArray, iteration)) {
        LoopingRosterSegamented = structuredClone(LoopReturnRaids[iteration])
        recurseProc((iteration + 1));
    } else {
        return;
    }
}
function isRaidValid(raidGroup) {
    var mainCharsInArrayValid = []
    //parentPort.postMessage({ obj: raidGroup, type: "log" })
    for (let j = 0; j < raidGroup.length; j++) {
        //parentPort.postMessage({ obj: A[i][j], type: "log" })
        if (j == 0) {
            mainCharsInArrayValid.push(raidGroup[j].charName)
        } else {
            //parentPort.postMessage({ obj: mainCharsInArrayValid, type: "log" })
            if (mainCharsInArrayValid.includes(raidGroup[j].mainsCharacterName.toString())) {
                //parentPort.postMessage({ obj: "Invalid Raid", type: "log" })
                return false;
            } else {
                mainCharsInArrayValid.push(raidGroup[j].charName)
            }
        }
    }
    mainCharsInArrayValid.splice(0)
    return true;


    // for (let j = 0; j < raidGroup.length; j++) {
    //     mainCharsInArrayValid.forEach(t => {
    //         if (t == raidGroup[j].mainsCharacterName) {
    //             if (raidGroup[j].main != 'Main') {
    //                 //not valid
    //                 return false
    //             }
    //         }
    //     })

    //     mainCharsInArrayValid.push(raidGroup[j.charName])
    //     // if (mainCharsInArray.some(a => { a.mainsCharacterName }) && raidGroup[j].main == "Alternate") {
    //     //     return false;
    //     // } else {
    //     //     try {
    //     //         mainCharsInArray.push(raidGroup[j].charName)
    //     //     } catch (error) {
    //     //         //parentPort.postMessage({ obj: raidGroup.length, type: "log" })
    //     //        // parentPort.postMessage({ obj: j, type: "log" })
    //     //          //parentPort.postMessage({ obj: raidGroup, type: "log" })
    //     //     }

    //     // }
    //}

    return true
}
function evaluateRaid(raidGroup) {
    let buffCollection = [];
    raidGroup.forEach(x => {
        //generate ria dbuff collection
        x.primarySpec.buffs.forEach(b => {
            if (buffCollection.some(q => q.buffCode == b.buffCode)) {
                if (buffCollection.some(q => (q.buffCode == b.buffCode && b.buffWeight > q.buffWeight))) {
                    //found item where weight is higher and buff code is the same
                    let index = buffCollection.indexOf(buffCollection.find(q => (q.buffCode == b.buffCode && b.buffWeight > q.buffWeight)))
                    buffCollection[index] = b
                }
            } else {
                buffCollection.push(b)
            }
        })
    })
    //console.log("Buff Collection Length: " + buffCollection.length)

    let raidWeight = 0
    buffCollection.forEach(b => {
        raidWeight += b.buffWeight
    })

    raidGroup.forEach(x => {
        if (x.main == 'Main') {
            raidWeight += 50;
        }
    })
    //console.log("Raid Weight: "+ raidWeight)

    return raidWeight;
}
function CleanPerms(A) {
    let filteredArray = []

    try {
        for (let i = 0; i < A.length; i++) {
            let addBool = true
            let mainCharsInArray = []
            for (let j = 0; j < A[i].length; j++) {
                if (j == 0) {
                    mainCharsInArray.push(A[i][j].charName)
                } else {
                    if (mainCharsInArray.includes(A[i][j].mainsCharacterName)) {
                        addBool = false
                    } else {
                        mainCharsInArray.push(A[i][j].charName)
                    }
                }
            }
            if (addBool) {
                filteredArray.push(A[i])
            }
            mainCharsInArray.length = 0;
            addBool = true;
        }
        filteredArray = filteredArray.sort(SortFunc);
        return filteredArray
    } catch (error) {
        parentPort.postMessage({ obj: error, type: "log" })
    }



}
function SortFunc(a, b) {
    let bVal = 0
    let aVal = 0
    a.forEach(d => {
        if (d.main == 'Main') {
            aVal = aVal + 100
        }
    })
    b.forEach(e => {
        if (e.main == 'Main') {
            bVal = bVal + 100
        }
    })
    return bVal - aVal
}
function removeForSubsequentAssignment(usedRaiders, originalRaid) {
    let subsetRaid = []
    for (let i = 0; i < originalRaid.length; i++) {
        let foundnameinusedRaider = false;
        for (let j = 0; j < usedRaiders.length; j++) {
            if (String(originalRaid[i].charName) == String(usedRaiders[j].charName)) {
                foundnameinusedRaider = true;
            } else {

            }
        }
        if (foundnameinusedRaider == false) {
            subsetRaid.push(originalRaid[i])
        }
    }

    if (subsetRaid.filter(e => { return e.primarySpec.role === "Tank" }).length < tankCount ||
        subsetRaid.filter(e => { return e.primarySpec.role == 'Healer' }).length < healerCount
    ) {
        return []
    } else {
        return subsetRaid
    }
}
function getCombined(tankPerm, healerPerm, rDPSPerm, mDPSPerm) {
    let bigArray = []
    tankLength = tankPerm.length
    healerLength = healerPerm.length
    rDPSLength = rDPSPerm.length
    mDPSLength = mDPSPerm.length
    let lengths = ["t" + tankLength, 'h' + healerLength, 'r' + rDPSLength, 'm' + mDPSLength]
    lengths.sort((a, b) => a > b)

    for (let i = 0; i < lengths.length; i++) {
        if (lengths[i] == 't' + tankPerm.length) {
            bigArray.push(tankPerm)
        } else if (lengths[i] == 'h' + healerPerm.length) {
            bigArray.push(healerPerm)
        } else if (lengths[i] == 'r' + rDPSPerm.length) {
            bigArray.push(rDPSPerm)
        } else if (lengths[i] == 'm' + mDPSPerm.length) {
            bigArray.push(mDPSPerm)
        }
    }
    return bigArray
}
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
function combinations(a, c) {
    let index = []
    let n = a.length

    for (let j = 0; j < c; j++)
        index[j] = j
    index[c] = n

    let ok = true
    let result = []

    while (ok) {

        let comb = []
        for (let j = 0; j < c; j++)
            comb[j] = a[index[j]]
        result.push(comb)

        ok = false

        for (let j = c; j > 0; j--) {
            if (index[j - 1] < index[j] - 1) {
                index[j - 1]++
                for (let k = j; k < c; k++)
                    index[k] = index[k - 1] + 1
                ok = true
                break
            }
        }
    }

    return result
}
function processTertiaryRaid(subRaid, iteration) {
    try {
        workingRangedCount = rangedCount;
        workingMeleeCount = meleeCount
        // var ReturnRaids = []
        // ReturnRaids[0] = bestRaid
        // ReturnRaids[1] = bestRaid

        let tankArray = subRaid.filter(e => { return e.primarySpec.role === "Tank" })
        let healerArray = subRaid.filter(e => { return e.primarySpec.role == 'Healer' })
        let rDPSArray = subRaid.filter(e => { return e.primarySpec.role == 'Ranged DPS' })
        let mDPSArray = subRaid.filter(e => { return e.primarySpec.role == 'Melee DPS' })

        // parentPort.postMessage({ obj: tankArray.length, type: "log" })
        // parentPort.postMessage({ obj: healerArray.length, type: "log" })
        // parentPort.postMessage({ obj: rDPSArray.length, type: "log" })
        // parentPort.postMessage({ obj: mDPSArray.length, type: "log" })
        // parentPort.postMessage({ obj: raidSize, type: "log" })

        if (tankArray.length < tankCount || healerArray.length < healerCount || ((raidSize - (rDPSArray.length + mDPSArray.length)) != (tankArray.length + healerArray.length))) {
            parentPort.postMessage({ obj: subRaid.length, type: "log" })
            parentPort.postMessage({ obj: tankArray.length, type: "log" })
            parentPort.postMessage({ obj: healerArray.length, type: "log" })
            parentPort.postMessage({ obj: rDPSArray.length, type: "log" })
            parentPort.postMessage({ obj: mDPSArray.length, type: "log" })
            parentPort.postMessage({ obj: "No Valid Raid able to be formed based on roles", type: "log" })
            return 0
        }

        //TODO  - Make some logic to remainder the Melee/Ranged DPS
        if (rDPSArray.length != rangedCount || mDPSArray.length != meleeCount) {
            workingRangedCount = rDPSArray.length;
            workingMeleeCount = mDPSArray.length;
            // parentPort.postMessage({ obj: "Working melee: "+ workingMeleeCount, type: "log" })
            // parentPort.postMessage({ obj: "Working ranged: "+ workingRangedCount, type: "log" })

        }


        let tankPerm = combinations(tankArray, tankCount)
        //parentPort.postMessage({ obj: "Tank Combinations: " + tankPerm.length, type: "log" })
        let healerPerm = combinations(healerArray, healerCount)
        //parentPort.postMessage({ obj: "Healer Combinations: " + healerPerm.length, type: "log" })
        let rDPSPerm = combinations(rDPSArray, workingRangedCount)
        //parentPort.postMessage({ obj: "Ranged DPS Combinations: " + rDPSPerm.length, type: "log" })
        let mDPSPerm = combinations(mDPSArray, workingMeleeCount)
        //parentPort.postMessage({ obj: "Melee DPS Combinations: " + mDPSPerm.length, type: "log" })

        //parentPort.postMessage({ obj: "Trying Cleans", type: "log" })
        tankPerm = CleanPerms(tankPerm)
        healerPerm = CleanPerms(healerPerm)
        rDPSPerm = CleanPerms(rDPSPerm)
        mDPSPerm = CleanPerms(mDPSPerm)
        // parentPort.postMessage({ obj: "Finished Cleans", type: "log" })

        // parentPort.postMessage({ obj: "Tank Combinations: " + tankPerm.length, type: "log" })
        // parentPort.postMessage({ obj: "Healer Combinations: " + healerPerm.length, type: "log" })
        // parentPort.postMessage({ obj: "Ranged DPS Combinations: " + rDPSPerm.length, type: "log" })
        // parentPort.postMessage({ obj: "Melee DPS Combinations: " + mDPSPerm.length, type: "log" })

        let bigAssArrayTwo = getCombined(tankPerm, healerPerm, rDPSPerm, mDPSPerm)


        //parentPort.postMessage({ obj: "Big Ass Array" + bigAssArrayTwo.length, type: "log" })



        for (let i = 0; i < bigAssArrayTwo[0].length; i++) {
            let raidGroup = []

            raidGroup.push(...bigAssArrayTwo[0][i])
            if (isRaidValid(raidGroup)) {

                for (let q = 0; q < bigAssArrayTwo[1].length; q++) {
                    bigAssArrayTwo[1][q].forEach(item => {
                        raidGroup.push(item)
                    })
                    if (isRaidValid(raidGroup)) {

                        for (let j = 0; j < bigAssArrayTwo[2].length; j++) {
                            bigAssArrayTwo[2][j].forEach(item => {
                                raidGroup.push(item)
                            })
                            //parentPort.postMessage({ obj: "Hello", type: "log" })

                            if (isRaidValid(raidGroup)) {

                                for (let k = 0; k < bigAssArrayTwo[3].length; k++) {

                                    bigAssArrayTwo[3][k].forEach(item => {
                                        raidGroup.push(item)
                                    })
                                    
                                    if (isRaidValid(raidGroup)) {
                                        //parentPort.postMessage({ obj: "Valid subRaid", type: "log" })
                                        let raidWeight = evaluateRaid(raidGroup)
                                        //parentPort.postMessage({ obj: "raidweight: " + raidWeight, type: "log" })
                                        if (raidWeight > (optimalWeight - (optimalWeight * .2))) {
                                            //parentPort.postMessage({ obj: "Second raid more optimal then previous. New RaidWeight: " + raidWeight, type: "log" })
                                            LoopReturnRaids[iteration].weight = raidWeight
                                            LoopReturnRaids[iteration].raid = structuredClone(raidGroup)
                                            return true;
                                        }
                                        //parentPort.postMessage({ obj: "Found Optimal Raid", type: "log" })
                                        //parentPort.postMessage({ obj: "ExtraRaid Length: " + (initialRosterCount - raidGroup.length), type: "log" })                                     
                                        let elementsToDeleteMeleeTwo = workingMeleeCount
                                        while (elementsToDeleteMeleeTwo--) {
                                            raidGroup.pop()
                                        }
                                    } else {
                                        let elementsToDeleteMelee = workingMeleeCount
                                        while (elementsToDeleteMelee--) {
                                            raidGroup.pop()
                                        }
                                    }
                                }
                                let elementsToDeleteRangedTwo = workingRangedCount
                                while (elementsToDeleteRangedTwo--) {
                                    raidGroup.pop()
                                }
                            } else {
                                let elementsToDeleteRanged = workingRangedCount
                                while (elementsToDeleteRanged--) {
                                    raidGroup.pop()
                                }
                            }
                        }
                        let elementsToDeleteHealerTwo = healerCount
                        while (elementsToDeleteHealerTwo--) {
                            raidGroup.pop()
                        }
                    } else {
                        let elementsToDeleteHealer = healerCount
                        while (elementsToDeleteHealer--) {
                            raidGroup.pop()
                        }
                    }

                }
                raidGroup = raidGroup.splice(0)
            } else {
                raidGroup = raidGroup.splice(0)
            }
        }

        if (LoopReturnRaids[iteration].weight > 0) {
            return true;
        }
        return false;

    } catch (error) {
        parentPort.postMessage({ obj: "********************************************", type: "log" })
        parentPort.postMessage({ obj: error, type: "log" })
        parentPort.postMessage({ obj: error.message, type: "log" })
        parentPort.postMessage({ obj: "********************************************", type: "log" })
    }
}






