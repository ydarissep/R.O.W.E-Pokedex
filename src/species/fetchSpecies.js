async function getSpecies(species){
    footerP("Fetching species")
    const rawSpecies = await fetch(`https://raw.githubusercontent.com/${repo}/include/constants/species.h`)
    const textSpecies = await rawSpecies.text()

    return regexSpecies(textSpecies, species)
}


async function getBaseStats(species){
    const rawBaseStats = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/pokemon/base_stats.h`)
    const textBaseStats = await rawBaseStats.text()
    return regexBaseStats(textBaseStats, species)
}

async function getLevelUpLearnsets(species){
    const rawLevelUpLearnsets = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/pokemon/level_up_learnsets.h`)
    const textLevelUpLearnsets = await rawLevelUpLearnsets.text()

    const rawLevelUpLearnsetsPointers = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/pokemon/level_up_learnset_pointers.h`)
    const textLevelUpLearnsetsPointers = await rawLevelUpLearnsetsPointers.text()


    const levelUpLearnsetsConversionTable = getLevelUpLearnsetsConversionTable(textLevelUpLearnsetsPointers)


    return regexLevelUpLearnsets(textLevelUpLearnsets, levelUpLearnsetsConversionTable, species)
}

async function getTMHMLearnsets(species){
    footerP("Fetching TMHM learnsets")
    const rawTMHMLearnsets = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/pokemon/tmhm_learnsets.h`)
    const textTMHMLearnsets = await rawTMHMLearnsets.text()

    const TMHMLearnsetsConversionTable = getTMHMLearnsetsConversionTable(textTMHMLearnsets)

    return regexTMHMLearnsets(textTMHMLearnsets, TMHMLearnsetsConversionTable, species)
}

async function getEvolution(species){
    const rawEvolution = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/pokemon/evolution.h`)
    const textEvolution = await rawEvolution.text()

    return regexEvolution(textEvolution, species)
}

async function getForms(species){
    const rawForms = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/pokemon/form_species_table.h`)
    const textForms = await rawForms.text()

    return regexForms(textForms, species)
}

async function getEggMovesLearnsets(species){
    const rawEggMoves = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/pokemon/egg_moves.h`)
    const textEggMoves = await rawEggMoves.text()

    return regexEggMovesLearnsets(textEggMoves, species)
}

async function getTutorLearnsets(species){
    footerP("Fetching tutor learnsets")
    const rawTutorLearnsets = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/pokemon/tutor_learnsets.h`)
    const textTutorLearnsets = await rawTutorLearnsets.text()

    const tutorLearnsetsConversionTable = getTutorLearnsetsConversionTable(textTutorLearnsets)

    return regexTutorLearnsets(textTutorLearnsets, tutorLearnsetsConversionTable, species)
}

async function getSprite(species){
    const rawFrontPicTable = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/pokemon_graphics/front_pic_table.h`)
    const textFrontPicTable = await rawFrontPicTable.text()

    const rawSprite = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/graphics/pokemon.h`)
    const textSprite = await rawSprite.text()

    const spriteConversionTable = getSpriteConversionTable(textFrontPicTable, species)

    return regexSprite(textSprite, spriteConversionTable, species)
}

async function getChanges(species, url){
    const rawChanges = await fetch(url)
    const textChanges = await rawChanges.text()
    return regexChanges(textChanges, species)
}

async function cleanSpecies(species){
    footerP("Cleaning up...")
    await Object.keys(species).forEach(name => {
        if(name === "SPECIES_WYRDEER" || name === "SPECIES_URSALUNA" || name === "SPECIES_BASCULEGION" || name === "SPECIES_OVERQWIL" || name === "SPECIES_QWILFISH_HUSIAN"){
            for (let i = 0; i < species[name]["forms"].length; i++){
                const targetSpecies = species[name]["forms"][i]
                for (let j = 0; j < species[targetSpecies]["forms"].length; j++){
                    if(species[targetSpecies]["forms"][j] === name){
                        species[targetSpecies]["forms"].splice(j, 1)
                    }
                }
            }
            for (let i = 0; i < species[name]["evolutionLine"].length; i++){
                const targetSpecies = species[name]["evolutionLine"][i]
                for (let j = 0; j < species[targetSpecies]["evolutionLine"].length; j++){
                    if(species[targetSpecies]["evolutionLine"][j] === name){
                        species[targetSpecies]["evolutionLine"].splice(j, 1)
                    }
                }
            }
            delete species[name]
        }
    })

    return species
}







async function buildSpeciesObj(){
    let species = {}
    try{
        species = await getSpecies(species)
        species = await initializeSpeciesObj(species)
        species = await getEvolution(species)
        species = await getForms(species) // should be called in that order until here
        species = await getBaseStats(species)
        species = await getChanges(species, "https://raw.githubusercontent.com/rh-hideout/pokeemerald-expansion/e22ac5161723e7baf711ac66fab28c8feff2cd85/src/data/pokemon/species_info.h")
        species = await getLevelUpLearnsets(species)
        species = await getTMHMLearnsets(species)
        species = await getEggMovesLearnsets(species)
        species = await getTutorLearnsets(species)
        species = await getSprite(species)

        species = await cleanSpecies(species)

        Object.keys(species).forEach(name => {
            if(species[name]["type1"] === "TYPE_DRAGON" || species[name]["type2"] === "TYPE_DRAGON"){
                if(!species[name]["tutorLearnsets"].includes("MOVE_DRACO_METEOR"))
                    species[name]["tutorLearnsets"].push("MOVE_DRACO_METEOR")
            }
            if(speciesHasType3(species[name])){
                species[name]["type3"] = speciesHasType3(species[name])
            }
        })
    }
    catch(e){
        console.log(e.message)
        console.log(e.stack)
        footerP("Fetching backup abilities")
        abilities = backupData[1]
    }
    await localStorage.setItem("species", LZString.compressToUTF16(JSON.stringify(species)))
    return species
}


function initializeSpeciesObj(species){
    for (const name of Object.keys(species)){
        species[name]["baseHP"] = 0
        species[name]["baseAttack"] = 0
        species[name]["baseDefense"] = 0
        species[name]["baseSpAttack"] = 0
        species[name]["baseSpDefense"] = 0
        species[name]["baseSpeed"] = 0
        species[name]["BST"] = 0
        species[name]["abilities"] = []
        species[name]["innates"] = []
        species[name]["type1"] = ""
        species[name]["type2"] = ""
        species[name]["item1"] = ""
        species[name]["item2"] = ""
        species[name]["eggGroup1"] = ""
        species[name]["eggGroup2"] = ""
        species[name]["changes"] = []
        species[name]["levelUpLearnsets"] = []
        species[name]["TMHMLearnsets"] = []
        species[name]["eggMovesLearnsets"] = []
        species[name]["tutorLearnsets"] = []
        species[name]["evolution"] = []
        species[name]["evolutionLine"] = [name]
        species[name]["forms"] = []
        species[name]["sprite"] = ""
    }
    return species
}


async function fetchSpeciesObj(){
    if(!localStorage.getItem("species"))
        window.species = await buildSpeciesObj()
    else
        window.species = await JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("species")))


    window.sprites = {}
    window.speciesTracker = []

    await Object.keys(species).forEach(async name => {
        if(localStorage.getItem(`${name}`)){
            sprites[name] = await LZString.decompressFromUTF16(localStorage.getItem(`${name}`))
            if(sprites[name].length < 500){
                localStorage.removeItem(name)
                spriteRemoveBgReturnBase64(name, species)
            }
        }
    })
    for(let i = 0, j = Object.keys(species).length; i < j; i++){
        speciesTracker[i] = {}
        speciesTracker[i]["key"] = Object.keys(species)[i]
        speciesTracker[i]["filter"] = []
    }

    tracker = speciesTracker
}

