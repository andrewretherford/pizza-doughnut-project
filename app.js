// fetch(url
//     // headers: {
//     //     'X-App-Token': 'd3kmc36b8ra99y02cgvf4tzby'
//     // }
// )
//     .then(res => res.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err))

    // constants

    const url = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?agency=NYPD'
    const appToken = 'd3kmc36b8ra99y02cgvf4tzby'
    
    // global variables
    let complaints
    let borough

    // DOM elements
    const buttons = document.querySelector('.buttons')
    const input = document.querySelector('#input')
    const complaintsBox = document.querySelector('.complaints-box')
    const inputForm = document.querySelector('.input-form')

    // global functions

    function sortArray(x, y) {
        if(x.complaint.split(' ')[0] < y.complaint.split(' ')[0]) {return -1}
        if(x.complaint.split(' ')[0] > y.complaint.split(' ')[0]) {return 1}
        return 0
    }

    // event handlers

    function clickHandler(e) {

        // clear previous child elements
        while(complaintsBox.firstChild) {
            complaintsBox.removeChild(complaintsBox.firstChild)
        }

        // assign value to borough
        if(e.target.id == 'staten-island') {
            borough = 'STATEN ISLAND'
        } else {
            borough = e.target.id
        }

        // get number of complaints from user
        if(input.value != '') {
            complaints = parseInt(input.value)
        } else { // default to 10 complaints
            complaints = 10
        }

        let complaintArray = []
        let sortedComplaints

        // populate complaints array with objects holding complaint and matching key
        fetch(url + '&borough=' + borough)
            .then(res => res.json())
            .then(data => {
                for(let i=0; i < complaints; i++) {
                    let randomIndex = Math.floor(Math.random() * data.length) 
                    complaintArray.push({complaint: data[randomIndex].complaint_type, key: data[randomIndex].unique_key})
                }
            })
            .then(() => {
                sortedComplaints = complaintArray.sort(sortArray)

                // create elements for each complaint
                for(let i=0; i < complaints; i++) {
                    const newComplaint = document.createElement('p')
                    const newButton = document.createElement('button')
                    const newResponse = document.createElement('p')
               
                    newComplaint.innerText = sortedComplaints[i].complaint
                    newButton.id = sortedComplaints[i].key
                    newButton.innerText = "Police Action Taken"
                    newButton.addEventListener('click', buttonHandler)

                    complaintsBox.append(newComplaint)
                    complaintsBox.append(newButton)
                    complaintsBox.append(newResponse)
                }
            })

        // input.value = ''
    }

    function buttonHandler(e) {
        // clear text if already populated
        if(e.target.nextSibling.innerText != '') {
            e.target.nextSibling.innerText = ''
        } else { // populate next child with the resolution
            fetch(url + '&unique_key=' + e.target.id)
                .then(res => res.json())
                .then(data => {
                    e.target.nextSibling.innerText = data[0].resolution_description
                })
        }
    }

    // event listeners

    buttons.addEventListener('click', clickHandler)