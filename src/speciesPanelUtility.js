fetch("https://raw.githubusercontent.com/ydarissep/dex-core/main/src/speciesPanelUtility.js").then(response => {
    return response.text()
}).then(text => {
    text = text.replace("buildSpeciesPanelLevelUpFromPreviousEvoTable(speciesPanelLevelUpFromPreviousEvoTable, name)", "buildSpeciesPanelLevelUpFromPreviousEvoTable(speciesPanelLevelUpFromPreviousEvoTable, name)\nbuildSpeciesPanelSignatureMove(name)")
    eval.call(window,text)
}).catch(error => {
    console.warn(error)
})



function buildSpeciesPanelSignatureMove(name){
    speciesPanelSignatureTable.classList.add("hide")
    if(species[name]["signature"]){
        speciesPanelSignatureTable.classList.remove("hide")
    }
    else{
        return
    }

    while (speciesPanelSignatureTableTbody.firstChild)
        speciesPanelSignatureTableTbody.removeChild(speciesPanelSignatureTableTbody.firstChild)

    const row = document.createElement("tr")

    const moveName = document.createElement("td")
    moveName.innerText = sanitizeString(species[name]["signature"]["name"])
    moveName.className = "bold"
    row.append(moveName)

    const typeContainer = document.createElement("td")
    const type = document.createElement("div")
    type.innerText = sanitizeString(species[name]["signature"]["type"]).slice(0,3)
    type.className = `${species[name]["signature"]["type"]} backgroundSmall`
    typeContainer.append(type)
    row.append(typeContainer)

    const splitContainer = document.createElement("td")
    const splitIcon = document.createElement("img")
    splitIcon.src = `src/moves/${moves[species[name]["signature"]["name"]]["split"]}.png`
    splitIcon.className = `${sanitizeString(moves[species[name]["signature"]["name"]]["split"])} splitIcon`
    splitContainer.append(splitIcon)
    row.append(splitContainer)

    const power = document.createElement("td")
    power.className = "speciesPanelLearnsetsPower"
    if(species[name]["signature"]["power"] > 0){
        power.innerText = species[name]["signature"]["power"]
    }
    else{
        power.innerText = "-"   
    }
    row.append(power)

    const accuracy = document.createElement("td")
    accuracy.className = "speciesPanelLearnsetsAccuracy"
    if(species[name]["signature"]["accuracy"] > 0){
        accuracy.innerText = species[name]["signature"]["accuracy"]
    }
    else{
        accuracy.innerText = "-"   
    }
    row.append(accuracy)

    const PP = document.createElement("td")
    PP.className = "speciesPanelLearnsetsPP"
    PP.innerText = moves[species[name]["signature"]["name"]]["PP"]
    row.append(PP)

    const movedescription = document.createElement("td")
    movedescription.className = "speciesPanelLearnsetsEffect"
    movedescription.innerText = species[name]["signature"]["description"]
    movedescription.style.width = "50ch"

    
    row.addEventListener('click', function () {
        createPopupForMove(moves[species[name]["signature"]["name"]])
        overlay.style.display = "flex"
    }) 

    row.append(movedescription)

    speciesPanelSignatureTableTbody.append(row)
}