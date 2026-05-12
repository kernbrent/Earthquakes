
const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const dayNames = [
    "Sun","Mon","Tue","Wed","Thu","Fri","Sat"
];

fetch('data/calendar.json')
.then(response => response.json())
.then(events => {

    const calendarContainer =
        document.getElementById('calendarContainer');

    const monthNav =
        document.getElementById('monthNav');

    const gamesList =
        document.getElementById('games-list');

    const groupedMonths = {};

    events.forEach(event => {

        const date = new Date(event.Date);

        const month = date.getMonth();

        if(!groupedMonths[month]){
            groupedMonths[month] = [];
        }

        groupedMonths[month].push(event);

    });

    const games = events
        .filter(event => event.EventType === "Game")
        .sort((a,b) => new Date(a.Date) - new Date(b.Date));

    const today = new Date();
    today.setHours(0,0,0,0);

    games.forEach(game => {

        const gameDate = new Date(game.Date);
        gameDate.setHours(0,0,0,0);

        let statusClass = "game-future";

        if(gameDate < today){
            statusClass = "game-past";
        }
        else if(gameDate.getTime() === today.getTime()){
            statusClass = "game-today";
        }

        const card =
            document.createElement('div');

        card.className =
            `game-list-item ${statusClass}`;

        const formattedDate =
            new Date(game.Date).toLocaleDateString(
                'en-US',
                {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }
            );

        card.innerHTML = `
            <div class="game-badge">GAME</div>

            <div class="game-list-date">
                ${formattedDate}
            </div>

            <div class="game-list-time">
                ${game.Time}
            </div>

            <div class="game-list-location">
                ${game.Location}
            </div>

            ${game.Opponent ? `
                <div class="game-list-opponent">
                    vs ${game.Opponent}
                </div>
            ` : ''}
        `;

        gamesList.appendChild(card);

    });

    Object.keys(groupedMonths).forEach(monthKey => {

        const month = parseInt(monthKey);

        const navButton =
            document.createElement('a');

        navButton.href =
            `#month-${month}`;

        navButton.innerText =
            monthNames[month];

        monthNav.appendChild(navButton);

        const section =
            document.createElement('section');

        section.className =
            'month-calendar-section';

        section.id =
            `month-${month}`;

        const title =
            document.createElement('h2');

        title.innerText =
            `${monthNames[month]} 2026`;

        section.appendChild(title);

        const grid =
            document.createElement('div');

        grid.className =
            'calendar-grid';

        dayNames.forEach(day => {

            const dayHeader =
                document.createElement('div');

            dayHeader.className =
                'calendar-day-header';

            dayHeader.innerText =
                day;

            grid.appendChild(dayHeader);

        });

        const firstDay =
            new Date(2026, month, 1);

        const startingDay =
            firstDay.getDay();

        const daysInMonth =
            new Date(2026, month + 1, 0).getDate();

        for(let i=0; i<startingDay; i++){

            const empty =
                document.createElement('div');

            empty.className =
                'calendar-day empty';

            grid.appendChild(empty);

        }

        for(let day=1; day<=daysInMonth; day++){

            const cell =
                document.createElement('div');

            cell.className =
                'calendar-day';

            const dateString =
                `2026-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

            const eventsForDay =
                groupedMonths[month].filter(
                    e => e.Date === dateString
                );

            cell.innerHTML =
                `<div class="day-number">${day}</div>`;

            eventsForDay.forEach(event => {

                const eventDiv =
                    document.createElement('div');

                eventDiv.className =
                    `event-card ${event.EventType.toLowerCase()}`;

                let html =
                    `
                    <div class="event-type">
                        ${event.EventType}
                    </div>

                    <div class="event-time">
                        ${event.Time}
                    </div>

                    <div class="event-location">
                        ${event.Location}
                    </div>
                    `;

                if(event.FieldNumber){

                    html +=
                        `
                        <div class="event-field">
                            ${event.FieldNumber}
                        </div>
                        `;
                }

                if(event.EventType === "Game" &&
                    event.Opponent){

                    html +=
                        `
                        <div class="event-opponent">
                            vs ${event.Opponent}
                        </div>
                        `;
                }

                eventDiv.innerHTML = html;

                cell.appendChild(eventDiv);

            });

            grid.appendChild(cell);

        }

        section.appendChild(grid);

        calendarContainer.appendChild(section);

    });

});
