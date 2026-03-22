function regexAbilities(textAbilities, abilities){
    const matchAbilitiesIngameName = textAbilities.match(/ABILITY_\w+.*._\(".*?"\)/gi)
    if (matchAbilitiesIngameName){
        matchAbilitiesIngameName.forEach(ingameNameString => {
            const matchIngameName = ingameNameString.match(/(ABILITY_\w+).*._\("(.*?)"\)/i)
            if (!(matchIngameName[1] in abilities)){
                abilities[matchIngameName[1]] = {}    
                abilities[matchIngameName[1]]["name"] = matchIngameName[1]
            }
            abilities[matchIngameName[1]]["ingameName"] = matchIngameName[2]
        })
    }

    const matchAbilitiesDescription = textAbilities.match(/ABILITY_\w+.*.FORMAT_ABILITY_DESCRIPTION\(".*?"\)/gi)
    if (matchAbilitiesDescription){
        matchAbilitiesDescription.forEach(descriptionString => {
            const matchDescription = descriptionString.match(/(ABILITY_\w+).*.FORMAT_ABILITY_DESCRIPTION\("(.*?)"\)/i)
            if (!(matchDescription[1] in abilities)){
                abilities[matchDescription[1]] = {}
                abilities[matchDescription[1]]["name"] = matchDescription[1]
                abilities[matchDescription[1]]["ingameName"] = sanitizeString(matchDescription[1])
            }
            abilities[matchDescription[1]]["description"] = matchDescription[2]
        })
    }
    return abilities
}