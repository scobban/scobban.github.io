async function fetchEvents() {
  const baseUrl = "https://sanctuarymaynard.showare.com";
    try {
      const response = await fetch(`${baseUrl}/upcomingeventperformancexml.asp`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
      const events = xmlDoc.querySelectorAll('Event');
      const imgStart = `${baseUrl}/uplimage/`;
      const eventList = document.getElementById("event-list");
      eventList.innerHTML = ""; // Clear existing content
  
      const fragment = document.createDocumentFragment(); // Document fragment for performance
  
      for (const event of events) {
        const eventId = `event-${event.querySelector("EventName").textContent}`;
        const name = event.querySelector("EventName").textContent;
        const [date, time] = event.querySelector("PerformanceDateTime").textContent.split(" ", 2); // Split on first space (max 2)
        // const description = event.querySelector("EventDescription").textContent;
        const link = event.querySelector("EventURL").textContent;
        const imgFull = `${imgStart}${event.querySelector("EventImage1").textContent}`;
        const buttonClasses = "sqs-block-button-element--large sqs-button-element--secondary sqs-block-button-element";
  
        const eventDetails = `
          <div id='${eventId}' class='event ${eventId}' target='_blank'>
            <a href='${link}' id='${eventId}' class='event ${eventId}' target='_blank'><div class='img'><img src=${imgFull} /></div></a>
            <div class='event-details'>
              <h2 class='event-name'>${name}</h2>
              <h3 class='event-date'>${date}</h3>
              <p class='event-time'>Doors TIME | Show TIME</p>
              <p class='event-action'>
                <a href='${link}'
                    id='${eventId}'
                    class='${buttonClasses}'
                    target='_blank'>
                      Buy Tickets
                </a>
              </p>
            </div>
          </div>
        `;
  
        const element = new DOMParser().parseFromString(eventDetails, 'text/html'); // Parse into HTML element
        fragment.appendChild(element.body.firstChild); // Append only the first child (event details)
      }
  
      eventList.appendChild(fragment); // Append the entire fragment at once
  
    } catch (error) {
      console.error(`There was a problem with the fetch operation:`, error);
    }
  }
  
  fetchEvents(); // Call the function