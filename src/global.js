window.repo = "BelialClover/RoweRepo/main"
window.checkUpdate = "11 ROWE"
window.showShinyToggle = true

fetch('https://raw.githubusercontent.com/ydarissep/dex-core/main/index.html').then(async response => {
	return response.text()
}).then(async rawHTMLText => {
	const parser = new DOMParser()

    rawHTMLText = rawHTMLText.replace("<table id=\"speciesPanelLevelUpFromPreviousEvoTable\"", 
        `<table id="speciesPanelSignatureTable" class="speciesPanelLearnsetsTableMargin hide">
            <caption class="bold">Signature</caption>
            <thead id="speciesPanelSignatureTableTHead">
              <tr>
                <!-- <th>Level</th> -->
                <th>Name</th>
                <th>Type</th>
                <th>Split</th>
                <th class="speciesPanelLearnsetsPower">Power</th>
                <th class="speciesPanelLearnsetsAccuracy">Acc</th>
                <th class="speciesPanelLearnsetsPP">PP</th>
                <th class="speciesPanelLearnsetsEffect">Effect</th>
              </tr>
            </thead>
            <tbody id="speciesPanelSignatureTableTbody"></tbody>
          </table>\n
          <table id="speciesPanelLevelUpFromPreviousEvoTable"`)

    rawHTMLText = rawHTMLText.replace(`<button id="onlyShowStrategyPokemon" type="button" class="setting">Strategy</button>`, 
        `<button id="onlySignaturePokemon" type="button" class="setting">Signature</button>\n
        <button id="onlyShowStrategyPokemon" type="button" class="setting">Strategy</button>`)

	const doc = parser.parseFromString(rawHTMLText, 'text/html')
    document.querySelector('html').innerHTML = doc.querySelector('html').innerHTML




    document.title = "R.O.W.E Dex"
    document.getElementById("footerName").innerText = "R.O.W.E\nYdarissep Pokedex"



    await fetch("https://raw.githubusercontent.com/ydarissep/dex-core/main/src/global.js").then(async response => {
        return response.text()
    }).then(async text => {
        text += `\n
        onlySignaturePokemon.addEventListener("click", () => {
            onlySignaturePokemon.classList.toggle("activeSetting")

            for(let i = 0, j = speciesTracker.length; i < j; i++){
                if(onlySignaturePokemon.classList.contains("activeSetting")){
                    if(!species[speciesTracker[i]["key"]]["signature"]){
                        speciesTracker[i]["filter"].push("signature")
                    }
                }
                else{
                    tracker[i]["filter"] = tracker[i]["filter"].filter(value => value !== "signature")
                }
            }
            lazyLoading(true)
        })`
        await eval.call(window,text)
        document.getElementById("trainersButton").classList.add("hide")
        window.speciesPanelSignatureTable = document.getElementById("speciesPanelSignatureTable")
        window.speciesPanelSignatureTableTbody = document.getElementById("speciesPanelSignatureTableTbody")
        window.onlySignaturePokemon = document.getElementById("onlySignaturePokemon")
    }).catch(error => {
        console.warn(error)
    })    

}).catch(error => {
	console.warn(error)
})


