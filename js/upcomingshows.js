// Imports
import * as gigManager from "./gigManager.js"
import * as dateHelper from "./datehelper.js"

// Local variables
var monthNames = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
];

const overlay = document.getElementById("overlay");
const modal = document.getElementById("update-gig-modal");
const closeButton = document.getElementById("close-button");
const eventContainer = document.getElementById("event_container");

// OnLoad Event
window.onload = async () => {
    if (document.body.classList.contains("upcomingshows")){
        PopulateCalendarPage();
    }
    else if (document.body.classList.contains("editcalendar")){
        PopulateEditCalendarPage();
        closeButton.addEventListener("click", () => CloseModal());
        console.log(`current date: ${currentDate.toLocaleString('en-us')}`);
        document.getElementById('GigDateAndTime').value = dateHelper.formatDate(new Date());
}

// Create single calendar html object for a gig object
function CreateCalendarObject(gig){

    // Create event divs
    const event = document.createElement("div");
    const eventRight = document.createElement("div");
    const eventLeft = document.createElement("div");
    const eventDate = document.createElement("div");
    const eventDay = document.createElement("div");
    const eventMonth = document.createElement("div");
    const eventTitle = document.createElement("h3");
    const eventDescription = document.createElement("div");
    const eventTime = document.createElement("div");

    event.classList.add("event");
    eventRight.classList.add("event_right");
    eventLeft.classList.add("event_left");
    eventDate.classList.add("event_date");
    eventDay.classList.add("event_day");
    eventMonth.classList.add("event_month");
    eventTitle.classList.add("event_title");
    eventDescription.classList.add("event_description");
    eventTime.classList.add("event_time");

    eventContainer.appendChild(event);
    event.appendChild(eventLeft);
    eventLeft.appendChild(eventDate);
    eventDate.appendChild(eventDay);
    eventDate.appendChild(eventMonth);

    event.appendChild(eventRight);
    eventRight.appendChild(eventTitle);
    eventRight.appendChild(eventDescription);
    eventRight.appendChild(eventTime);

    // Fill in information
    const gigDateAndTime = dateHelper.ConvertFromISO(gig.DateAndTime);
    console.log(gigDateAndTime);
    eventDay.innerHTML = gigDateAndTime.getDate();
    eventMonth.innerHTML = monthNames[gigDateAndTime.getMonth()];
    eventTime.innerHTML = "<img src=images/time.png alt=\"\" />";
    eventTime.innerHTML += gigDateAndTime.toLocaleString('en-us', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    eventTitle.innerHTML = gig.Title;

        // create description and location paragraphs for each line from input
    const descriptionLines = gig.Description.split("\n");
    const locationLines = gig.Location.split("\n");

    descriptionLines.forEach((line) => {
        const descParagraph = document.createElement("p");
        descParagraph.textContent = line;
        eventDescription.appendChild(descParagraph);
    });
    eventDescription.appendChild(document.createElement("br"));
    locationLines.forEach((line) => {
        const locationParagraph = document.createElement("p");
        locationParagraph.textContent = line;
        eventDescription.appendChild(locationParagraph);
    });
    
}

// Display upcoming shows on html page using data returned from API
async function PopulateCalendarPage(){
    console.log("Running PopulateCalendarPage");

    const gigsFromDB = await gigManager.GetGigs(); // get gig list from DB
    console.log(`Gigs retrieved from API: ${JSON.stringify(gigsFromDB)}`);

    // Filter out past gigs
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0); //reset the time for date comparison regardless of time
    const futureGigs = gigsFromDB.filter((x) => { 
        const gigDate = new Date(x.DateAndTime).setHours(0,0,0,0);
        return gigDate >= currentDate;
    });

    console.log(`future gigs: ${JSON.stringify(futureGigs)}`);

    // Construct page differently if no future gigs
    if (futureGigs.length == 0){
        // Create new div with informational text
        const noGigsDiv = document.createElement("div");
        const firstLine = document.createElement("h1");
        const secondLine = document.createElement("h1");
        firstLine.innerHTML = "We have no upcoming gigs at the moment.";
        secondLine.innerHTML = "More coming soon!";
        noGigsDiv.appendChild(firstLine);
        noGigsDiv.appendChild(secondLine);
        noGigsDiv.style.textAlign = "center";
        eventContainer.appendChild(noGigsDiv);
    } 
    else{
        // Group gigs by year
        const groupedGigs = GroupByYear(futureGigs);
        console.log(`Gigs grouped by year: ${JSON.stringify(groupedGigs)}`);

        groupedGigs.forEach((group) => {
            // Create header for year
            const yearHeader = document.createElement("h3");
            yearHeader.classList.add("year");
            yearHeader.innerHTML = group[0];
            eventContainer.appendChild(yearHeader);

            // Add calendar objects for each gig in given year (group key)
            group[1].forEach((currentGig) => {
                CreateCalendarObject(currentGig)
            });
        });
    }
}

// Display upcoming shows on html page using data returned from API with update, delete, and create functionality
async function PopulateEditCalendarPage(){
    console.log("Running PopulateEditCalendarPage");
    const eventContainer = document.getElementById("event_container");
    const gigsFromDB = await gigManager.GetGigs(); // get gig list from DB
    console.log(`Gigs retrieved from API: ${JSON.stringify(gigsFromDB)}`);

    // Filter out past gigs
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0); //reset the time for date comparison regardless of time
    const futureGigs = gigsFromDB.filter((x) => { 
        const gigDate = new Date(x.DateAndTime).setHours(0,0,0,0);
        return gigDate >= currentDate;
    });

    console.log(`future gigs: ${JSON.stringify(futureGigs)}`);

    // Group gigs by year
    const groupedGigs = GroupByYear(futureGigs);
    console.log(`Gigs grouped by year: ${JSON.stringify(groupedGigs)}`);

    groupedGigs.forEach((group) => {
        // Create header for year
        const yearHeader = document.createElement("h3");
        yearHeader.classList.add("year");
        yearHeader.innerHTML = group[0];
        eventContainer.appendChild(yearHeader);

        // Add calendar objects for each gig in given year (group key)
        group[1].forEach((currentGig) => {
            CreateCalendarObject(currentGig);
            const modificationButtons = document.createElement("div");
            const updateButton = document.createElement("button");
            const deleteButton = document.createElement("button");
            updateButton.innerText = "Edit";
            deleteButton.innerText = "Delete";
            modificationButtons.classList.add("modification-buttons");
            deleteButton.id = "deletegig-button";
            deleteButton.addEventListener("click", async () => await OnDeleteGig(currentGig._id));
            updateButton.addEventListener("click", () => OpenEditModal(currentGig))

            modificationButtons.appendChild(updateButton);
            modificationButtons.appendChild(deleteButton);
            eventContainer.appendChild(modificationButtons);
        });
    });

    // Add create gig button at bottom of gigs list
    const createGigButton = document.createElement("button");
    createGigButton.innerText = "Add New Gig";
    createGigButton.addEventListener("click", async () => await OnCreateGig());
    eventContainer.appendChild(createGigButton);
}

// Function to open update gig modal and fill in existing info
function OpenEditModal(currentGig){
    modal.classList.add("active");
    overlay.classList.add("active");

    // Fill in existing gig data by getting elements and updating values
    const gigTitleInput = document.getElementById("GigTitle");
    gigTitleInput.value = currentGig.Title;
    const gigDescriptionInput = document.getElementById("GigDescription");
    gigDescriptionInput.value = currentGig.Description;
    const gigLocationInput = document.getElementById("GigLocation");
    gigLocationInput.value = currentGig.Location;
    const gigDateAndTimeInput = document.getElementById("GigDateAndTime");
    gigDateAndTimeInput.value = dateHelper.formatDate(dateHelper.ConvertFromISO(new Date(currentGig.DateAndTime)));

    // Assign submit functionality
    const form = document.getElementById("updategig-form");
    form.addEventListener("submit", async (event) => { 
        event.preventDefault();
        await EditGigSubmit(currentGig);
    });

    console.log(`Edit Gig Modal Opened for gig: ${currentGig._id}`);
}

// Function to create gig and reload page
async function OnCreateGig(){
    // open empty gig modal
    modal.classList.add("active");
    overlay.classList.add("active");

    // Update form current date
    const gigDateAndTimeInput = document.getElementById("GigDateAndTime");
    gigDateAndTimeInput.value = dateHelper.formatDate(new Date());

    // Assign submit functionality
    const form = document.getElementById("updategig-form");
    const submitButton = document.getElementById("updategig-submit-button");
    submitButton.innerText = "Create";
    form.addEventListener("submit", async (event) => { 
        event.preventDefault();
        await CreateGigSubmit();
    });
}

// Function to delete gig and reload page
async function OnDeleteGig(gigId){
    const userConfirmation = confirm('Are you sure you want to delete this gig?'); // confirm operation before proceeding

    if (userConfirmation){
        const response = await gigManager.DeleteGig(gigId); // Delete gig from DB
        if (response){
            alert("gig successfully deleted");
        }
        else{
            alert("deletion was unsuccessful, let Izzy know");
        }
        ReloadEditPage();
    } 
}

// Function to make PUT request to update selected gig
async function EditGigSubmit(currentGig){
    console.log("Update Gig Form Submitted");

    // Get updated gig information
    const gigTitleInput = document.getElementById("GigTitle");
    const gigDescriptionInput = document.getElementById("GigDescription");
    const gigLocationInput = document.getElementById("GigLocation");
    const gigDateAndTimeInput = document.getElementById("GigDateAndTime");

    const updatedGig = {
        Title: gigTitleInput.value,
        Description: gigDescriptionInput.value,
        Location: gigLocationInput.value,
        DateAndTime: gigDateAndTimeInput.value,
        Band: "DynamiteRhythm"
    }

    var response = await gigManager.UpdateGig(currentGig._id, updatedGig);

    if(response){
        alert("successfully updated gig");
    }
    else{
        alert("update was unsuccessful, let Izzy know");
    }

    CloseModal();
    ReloadEditPage();
}

async function CreateGigSubmit(){
    console.log("Create Gig Form Submitted");
    // Get new gig information
    const gigTitleInput = document.getElementById("GigTitle");
    const gigDescriptionInput = document.getElementById("GigDescription");
    const gigLocationInput = document.getElementById("GigLocation");
    const gigDateAndTimeInput = document.getElementById("GigDateAndTime");

    const newGig = {
        Title: gigTitleInput.value,
        Description: gigDescriptionInput.value,
        Location: gigLocationInput.value,
        DateAndTime: gigDateAndTimeInput.value,
        Band: "DynamiteRhythm"
    }
    const response = await gigManager.CreateGig(newGig);

    if (response){
        alert("gig created successfully");
    }
    else{
        alert("error creating gig, let Izzy know");
    }

    CloseModal();
    ReloadEditPage();
}

function ReloadEditPage(){
    ClearEvents();
    PopulateEditCalendarPage();
    ClearForm();
}

function CloseModal(){
    modal.classList.remove('active')
    overlay.classList.remove('active')
    ClearForm();
    // remove form submission event listener by replacing with new clone
    const form = document.getElementById("updategig-form");
    form.replaceWith(form.cloneNode(true));
}

function ClearEvents(){
    while(eventContainer.firstChild){
        eventContainer.removeChild(eventContainer.firstChild);
    }
}

function ClearForm(){
    const gigTitleInput = document.getElementById("GigTitle");
    const gigDescriptionInput = document.getElementById("GigDescription");
    const gigLocationInput = document.getElementById("GigLocation");
    const gigDateAndTimeInput = document.getElementById("GigDateAndTime");

    gigTitleInput.value = "";
    gigDescriptionInput.value = "";
    gigLocationInput.value = "";
    gigDateAndTimeInput.value = dateHelper.formatDate(new Date());
}

// Function to group gig list by year
function GroupByYear(gigs){
    const gigList = gigs;
    const groupedResult = gigList.reduce((group, gig) => {
        const gigDateAndTime = new Date(gig.DateAndTime);
        const year = gigDateAndTime.getFullYear();
        group[year] = group[year] ?? []
        group[year].push(gig);
        return group;
    }, {});

    return Object.entries(groupedResult);
}


//-----------------------------------------------------------------------------------------------------------------------------------

// EXAMPLE EVENT
/* <div class = "event">
            <div class = "event_left">
                <div class = "event_date">
                    <div class = "event_day">23</div>
                    <div class = "event_month">June</div>
                </div>  
            </div>
            
            <div class = "event_right">
                <h3 class = "event_title">Private Concert</h3>
                <div class = "event_description">
                    <p>Pawtucket, RI</p>
                </div>
                <div class = "event_time"> <img src=images/time.png alt="" />6:30 pm</div>
            </div>   
        </div> */}


// Gig Schema
// const GigSchema = new Schema(
//     {
//         Title: String,
//         Location: String,
//         Description: String,
//         Band: String,
//         DateAndTime: Date,
//         _id: mongodb.ObjectId
//     }
// );