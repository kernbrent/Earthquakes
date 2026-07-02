const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const dayNames = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];


function closeEventModal() {

    document
        .getElementById('eventModal')
        .classList.remove('active');

}

window.closeEventModal =
    closeEventModal;

function openPracticeModal(event) {

    const html = `

<div class="practice-popup">

    <div class="practice-popup-left">

        <img
            src="images/aerial-map.jpg"
            class="practice-image">

    </div>

    <div class="practice-popup-right">

        <h2>
            Team Practice
        </h2>

        <p>
            <strong>Date:</strong>
            ${event.Date}
        </p>

        <p>
            <strong>Time:</strong>
            ${event.Time}
        </p>

        <p>
            <strong>Location:</strong>
            ${event.Location}
        </p>

        <p>
            Regular team practice.
            Please arrive 15 minutes early.
        </p>

    </div>

</div>

`;

    document
        .getElementById('eventModalContent')
        .innerHTML = html;

    document
        .getElementById('eventModal')
        .classList.add('active');

}

let rosterData = [];
let resultsData = [];

async function loadSupportingData() {

    try {

        const rosterResponse =
            await fetch('data/roster.json');

        rosterData =
            await rosterResponse.json();

    }
    catch (e) {

        rosterData = [];

    }

    try {

        const resultsResponse =
            await fetch('data/results.json');

        resultsData =
            await resultsResponse.json();

    }
    catch (e) {

        resultsData = [];

    }

}

function playerName(jersey) {

    const player =
        rosterData.find(
            p =>
                p.JerseyNumber == jersey
        );

    return player
        ? `#${jersey} ${player.FullName}`
        : `#${jersey}`;

}

/* =========================================
   SAFE LOCAL DATE PARSER
========================================= */

function parseLocalDate(dateString) {

    const [year, month, day] =
        dateString.split('-').map(Number);

    return new Date(year, month - 1, day);

}

loadSupportingData()
    .then(() => {

        fetch('data/calendar.json')
            .then(response => response.json())
            .then(events => {

                /* =========================================
                   ADD RECURRING PRACTICES
                ========================================= */

                if (typeof generatePracticeEvents === 'function') {

                    events = [
                        ...events,
                        ...generatePracticeEvents()
                    ];

                }

                const calendarContainer =
                    document.getElementById('calendarContainer');

                const monthNav =
                    document.getElementById('monthNav');

                const gamesList =
                    document.getElementById('games-list');

                const groupedMonths = {};

                events.forEach(event => {

                    const date =
                        parseLocalDate(event.Date);

                    const month =
                        date.getMonth();

                    if (!groupedMonths[month]) {
                        groupedMonths[month] = [];
                    }

                    groupedMonths[month].push(event);

                });

                /* =========================================
                   UPCOMING GAMES SIDEBAR
                ========================================= */

                const games = events
                    .filter(event => event.EventType === "Game")
                    .sort((a, b) =>
                        parseLocalDate(a.Date) -
                        parseLocalDate(b.Date)
                    );

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                games.forEach(game => {

                    const gameDate =
                        parseLocalDate(game.Date);

                    gameDate.setHours(0, 0, 0, 0);

                    let statusClass = "game-future";

                    if (gameDate < today) {
                        statusClass = "game-past";
                    }
                    else if (gameDate.getTime() === today.getTime()) {
                        statusClass = "game-today";
                    }

                    const card =
                        document.createElement('div');

                    card.className =
                        `game-list-item ${statusClass}`;

                    const formattedDate =
                        parseLocalDate(game.Date)
                            .toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }
                            );

                    if (statusClass === "game-past") {

                        card.innerHTML = `

                <div class="game-badge">
                    GAME
                </div>

                <div class="game-list-date">
                    ${formattedDate}
                </div>

            `;

                    }
                    else {

                        card.innerHTML = `

                <div class="game-badge">
                    GAME
                </div>

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

                    }

                    card.style.cursor = 'pointer';
                    card.addEventListener('click', () => { document.querySelector(`[data-game-date="${game.Date}"]`)?.click(); });
                    gamesList.appendChild(card);

                });

                /* =========================================
                   CALENDAR GENERATION
                ========================================= */
                const currentMonth =
                    new Date().getMonth();

                const visibleMonths = [];

                for (let i = 0; i < 4; i++) {

                    visibleMonths.push(
                        (currentMonth + i) % 12
                    );

                }

                Object.keys(groupedMonths).forEach(monthKey => {

                    const month = parseInt(monthKey);

                    if (
                        !visibleMonths.includes(month)
                    ) {
                        return;
                    }

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

                    for (let i = 0; i < startingDay; i++) {

                        const empty =
                            document.createElement('div');

                        empty.className =
                            'calendar-day empty';

                        grid.appendChild(empty);

                    }

                    for (let day = 1; day <= daysInMonth; day++) {

                        const cell =
                            document.createElement('div');

                        cell.className =
                            'calendar-day';

                        const today = new Date();

                        today.setHours(0, 0, 0, 0);

                        const cellDate =
                            new Date(2026, month, day);

                        cellDate.setHours(0, 0, 0, 0);

                        if (cellDate < today) {

                            cell.style.opacity = '.45';

                            cell.style.background =
                                'rgba(255,255,255,.03)';

                        }

                        const dateString =
                            `2026-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

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
                            if (event.EventType === 'Game') { eventDiv.setAttribute('data-game-date', event.Date); }

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

                            if (event.FieldNumber) {

                                html +=
                                    `
                        <div class="event-field">
                            ${event.FieldNumber}
                        </div>
                        `;
                            }

                            if (event.EventType === "Game" &&
                                event.Opponent) {

                                html +=
                                    `
                        <div class="event-opponent">
                            vs ${event.Opponent}
                        </div>
                        `;
                            }

                            eventDiv.innerHTML = html;

                            if (
                                event.EventType ===
                                "Practice"
                            ) {

                                eventDiv.addEventListener(
                                    'click',
                                    () => {

                                        openPracticeModal(
                                            event
                                        );

                                    }
                                );

                            }
                            if (
                                event.EventType ===
                                "Game"
                            ) {

                                eventDiv.addEventListener(
                                    'click',
                                    () => {

                                        const result =
                                            resultsData.find(
                                                r =>
                                                    r.Date === event.Date
                                            );

                                        let popupHtml = '';

                                        if (!result) {

                                            popupHtml = `

                <div class="game-popup">

                    <div class="game-matchup">

                        NTX Earthquakes

                        <br>

                        vs

                        <br>

                        ${event.Opponent || 'TBD'}

                    </div>

                    <div class="game-score">

                        TBD
                    </div>

                    <div class="game-details">

                        <div class="game-card">

                            <h4>
                                Winner
                            </h4>

                            TBD

                        </div>

                        <div class="game-card">

                            <h4>
                                Location
                            </h4>

                            ${event.Location}

                        </div>

                        <div class="game-card">

                            <h4>
                                Goal Scorers
                            </h4>

                            TBD

                        </div>

                        <div class="game-card">

                            <h4>
                                Player(s) of Game
                            </h4>

                            TBD

                        </div>

                    </div>

                </div>

                `;

                                        }
                                        else {

                                            const scorers =
                                                (result.GoalScorers || [])
                                                    .map(playerName)
                                                    .join('<br>');

                                            const pog =
                                                (result.PlayersOfGame || [])
                                                    .map(playerName)
                                                    .join('<br>');

                                            popupHtml = `

                <div class="game-popup">

                    <div class="game-matchup">

                        NTX Earthquakes

                        <br>

                        vs

                        <br>

                        ${event.Opponent || 'TBD'}

                    </div>

                    <div class="game-score">

                        ${result.EarthquakesScore}
                        -
                        ${result.OpponentScore}

                    </div>

                    <div class="game-details">

                        <div class="game-card">

                            <h4>
                                Winner
                            </h4>

                            ${result.EarthquakesWon === 'Y'
                                                    ? 'NTX Earthquakes'
                                                    : event.Opponent
                                                }

                        </div>

                        <div class="game-card">

                            <h4>
                                Location
                            </h4>

                            ${event.Location}

                        </div>

                        <div class="game-card">

                            <h4>
                                Goal Scorers
                            </h4>

                            ${scorers || 'None'}

                        </div>

                        <div class="game-card">

                            <h4>
                                Players of Game
                            </h4>

                            ${pog || 'None'}

                        </div>

                    </div>

                    <div class="game-card">

                        <h4>
                            Notes
                        </h4>

                        ${result.Notes || ''}

                    </div>

                </div>

                `;

                                        }

                                        document
                                            .getElementById(
                                                'eventModalContent'
                                            )
                                            .innerHTML =
                                            popupHtml;

                                        document
                                            .getElementById(
                                                'eventModal'
                                            )
                                            .classList
                                            .add('active');

                                    }
                                );

                            }

                            cell.appendChild(eventDiv);

                        });

                        grid.appendChild(cell);

                    }

                    section.appendChild(grid);

                    calendarContainer.appendChild(section);

                });

            });
    });
