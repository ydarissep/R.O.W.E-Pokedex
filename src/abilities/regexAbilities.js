function regexAbilities(textAbilities, abilities){
    const lines = textAbilities.split("\n")
    let conversionTable = {}, english = true

    for(let i = lines.length - 1; i >= 0; i--){
        if(/#else/.test(lines[i])){
            english = false
        }
        else if(/LANGUAGE_SPANISH/.test(lines[i])){
            english = true
        }
        
        if(english){
            let ability = lines[i].match(/(ABILITY_\w+)/i) //this is going to get confusing real quick :)
            if(ability){
                ability = ability[0]


                if(abilities[ability] === undefined){
                    abilities[ability] = {}
                    abilities[ability]["name"] = ability
                }
                

                const matchAbilityIngameName = lines[i].match(/_ *\( *" *(.*)" *\) *,/i)
                if(matchAbilityIngameName){
                    const abilityIngameName = matchAbilityIngameName[1]

                    abilities[ability]["ingameName"] = abilityIngameName
                }
            }


            const matchConversionDescription = lines[i].match(/s\w+Description/i)
            if(matchConversionDescription){
                const conversionDescription = matchConversionDescription[0]



                if(ability){ // :=)


                    if(conversionTable[conversionDescription] === undefined)
                        conversionTable[conversionDescription] = [ability]
                    else
                        conversionTable[conversionDescription].push(ability)


                }
                else{
                    const matchDescription = lines[i].match(/_ *\( *" *(.*)" *\) *;/i)
                    if(matchDescription){
                        const description = matchDescription[1].replaceAll("-\\n", "").replaceAll("\\n", " ")
                        if(conversionTable[conversionDescription] !== undefined){
                            for(let j = 0; j < conversionTable[conversionDescription].length; j++)
                            abilities[conversionTable[conversionDescription][j]]["description"] = description
                        }
                    }
                }
            }
        }
    }
    return abilities
}