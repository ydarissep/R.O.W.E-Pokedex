window.repo = "BelialClover/RoweRepo/main"
window.checkUpdate = "10 ROWE"
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

	const doc = parser.parseFromString(rawHTMLText, 'text/html')
    document.querySelector('html').innerHTML = doc.querySelector('html').innerHTML




    document.title = "R.O.W.E Dex"
    document.getElementById("footerName").innerText = "R.O.W.E\nYdarissep Pokedex"



    await fetch("https://raw.githubusercontent.com/ydarissep/dex-core/main/src/global.js").then(async response => {
        return response.text()
    }).then(async text => {
        await eval.call(window,text)
        document.getElementById("trainersButton").classList.add("hide")
        window.speciesPanelSignatureTable = document.getElementById("speciesPanelSignatureTable")
        window.speciesPanelSignatureTableTbody = document.getElementById("speciesPanelSignatureTableTbody")
    }).catch(error => {
        console.warn(error)
    })    

}).catch(error => {
	console.warn(error)
})


