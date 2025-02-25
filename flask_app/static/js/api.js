function updateData() {
    fetch('/api/top-100')
    .then(response => response.json())
    .then(data => {
        document.getElementById('coinTableBody').innerHTML = '';

        data.forEach((coin, index) => {
            const row = document.createElement('tr');
            const mcap = coin.market_cap;
            const number = Number(mcap); 
            let fmcap = '';
            
            // Format based on the actual number value
            if (number >= 1000000000000) { // 1 trillion or more
                fmcap = (number / 1000000000000).toFixed(1) + 'T'; // Trillion
            } else if (number >= 1000000000) { // Billions
                fmcap = (number / 1000000000).toFixed(3) + 'B'; // No fixed decimal, just toString()
            } else if (number >= 1000000) { // Millions
                fmcap = (number / 1000000).toFixed(3) + 'M'; 
            }

            // Price change logic
            let priceChange = coin.price_change_percentage_24h;
            let changeSymbol = priceChange >= 0 ? '' : '';
            let color = priceChange >= 0 ? '#00fa11' : '#fa0000'; // Green for up, red for down
            let svgPath = priceChange >= 0 ? 
                '<path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path>' :
                '<path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z" transform="rotate(180 165 165)"></path>';

            let priceChangeHtml = `<td>
                <svg fill="${color}" height="15" width="15" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="${color}">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        ${svgPath}
                    </g>
                </svg> ${changeSymbol}${Math.abs(priceChange).toFixed(1)}%
            </td>`;

            // Alert icon logic
            let alertIcon = '';
            if (loggedIn) {
                // If user is logged in, add the alert icon
                alertIcon = `
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
                            <g fill="#be00ff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                                <g transform="scale(8.53333,8.53333)">
                                    <path d="M15,3c-6.627,0 -12,5.373 -12,12c0,6.627 5.373,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.627 -5.373,-12 -12,-12zM21,16h-5v5c0,0.553 -0.448,1 -1,1c-0.552,0 -1,-0.447 -1,-1v-5h-5c-0.552,0 -1,-0.447 -1,-1c0,-0.553 0.448,-1 1,-1h5v-5c0,-0.553 0.448,-1 1,-1c0.552,0 1,0.447 1,1v5h5c0.552,0 1,0.447 1,1c0,0.553 -0.448,1 -1,1z"></path>
                                </g>
                            </g>
                        </svg>
                    </td>`;
            } else {
                // If not logged in, an empty cell is added
                alertIcon = '<td></td>';
            }
        
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${coin.name}</td>
                <td>${coin.symbol.toUpperCase()}</td>
                <td>$${coin.current_price}</td>
                ${priceChangeHtml}
                <td>${fmcap}</td>
                <td><img src="${coin.image}" alt="${coin.name}" width="30" id="coinImg"></td>
                <td><a class="a-watch" href="/watchlist/add/${coin.id}"${alertIcon}</a></td>
            `;
            document.getElementById('coinTableBody').appendChild(row);
        });
    })
    .catch(err => console.error('Error fetching data:', err));
}

function globalData() {
    fetch('/api/global-market')
    .then(response => response.json())
    .then(data => {
        const globalContent = document.getElementById('globalContent');
        globalContent.innerHTML = ''; 

        const global24 = data.data.market_cap_change_percentage_24h_usd;
        const changeSymbol = global24 >= 0 ? '+' : '';

        const color = global24 >= 0 ? '#0aff0e' : '#ff0000'; // Green for positive, red for negative

        // SVG 
        const svgIcon = `
            <svg id="Combo Chart" width="120" height="120" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <rect width="24" height="24" stroke="none" fill="#000000" opacity="0"/>
                <g transform="matrix(0.42 0 0 0.42 12 12)">
                    <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${color}; fill-rule: nonzero; opacity: 1;" transform="translate(-25, -26)" d="M 45 2 C 43.894531 2 43 2.894531 43 4 C 43 4.292969 43.074219 4.5625 43.1875 4.8125 L 35.1875 16 C 35.125 15.996094 35.0625 16 35 16 C 34.601563 16 34.21875 16.109375 33.90625 16.3125 L 27 12.875 C 26.933594 11.828125 26.0625 11 25 11 C 23.894531 11 23 11.894531 23 13 C 23 13.105469 23.015625 13.210938 23.03125 13.3125 L 15.71875 19.125 C 15.496094 19.039063 15.253906 19 15 19 C 14 19 13.179688 19.730469 13.03125 20.6875 L 6.21875 23.4375 C 5.878906 23.171875 5.460938 23 5 23 C 3.894531 23 3 23.894531 3 25 C 3 26.105469 3.894531 27 5 27 C 6.007813 27 6.832031 26.253906 6.96875 25.28125 L 13.78125 22.5625 C 14.121094 22.828125 14.539063 23 15 23 C 16.105469 23 17 22.105469 17 21 C 17 20.894531 16.984375 20.789063 16.96875 20.6875 L 24.28125 14.875 C 24.503906 14.960938 24.746094 15 25 15 C 25.398438 15 25.78125 14.890625 25.09375 14.6875 L 33 18.125 C 33.066406 19.171875 33.9375 20 35 20 C 36.105469 20 37 19.105469 37 18 C 37 17.707031 36.925781 17.4375 36.8125 17.1875 L 44.8125 6 C 44.875 6.003906 44.9375 6 45 6 C 46.105469 6 47 5.105469 47 4 C 47 2.894531 46.105469 2 45 2 Z M 41 15 L 41 50 L 49 50 L 49 15 Z M 43 17 L 47 17 L 47 48 L 43 48 Z M 21 24 L 21 50 L 29 50 L 29 24 Z M 23 26 L 27 26 L 27 48 L 23 48 Z M 31 29 L 31 50 L 39 50 L 39 29 Z M 33 31 L 37 31 L 37 48 L 33 48 Z M 11 32 L 11 50 L 19 50 L 19 32 Z M 13 34 L 17 34 L 17 48 L 13 48 Z M 1 36 L 1 50 L 9 50 L 9 36 Z M 3 38 L 7 38 L 7 48 L 3 48 Z" stroke-linecap="round" />
                </g>
            </svg>`;

        // Update the content with SVG and percentage
        if (color === '#0aff0e'){
            globalContent.innerHTML = `
            ${svgIcon} ${changeSymbol}<h3>+${Math.abs(global24).toFixed(1)}%</h3>
        `;
        }
        else {
            globalContent.innerHTML = `
            ${svgIcon} ${changeSymbol}<h3>-${Math.abs(global24).toFixed(1)}%</h3>
        `;
        }
    })
    .catch(err => console.error('Error fetching global data:', err));
}


function trendingCoin() {
    fetch('/api/trending')
    .then(response => response.json())
    .then(data => {
        const trending = document.getElementById('trendingData')
        trending.innerHTML = ''

        for(var i = 0; i < 3; i ++) {
            const coin = data.coins[i].item; 
            const trendingRow = document.createElement('tr');

            trendingRow.innerHTML = `
            <td><img src="${coin.thumb}" alt="${coin.name}" width="40" id="coinImg"></td>
            <td><b>${coin.name}</b> - </td>
            <td>$${coin.data.price.toFixed(2)}</td>
        `;
        document.getElementById('trendingData').appendChild(trendingRow);
        }

    })
}


function watchlistData() {
    fetch('/watchlist/get')
    .then(response => response.json())
    .then(data => {
        document.getElementById('watchTableBody').innerHTML = '';

        data.forEach((coin, index) => {
            const watchRow = document.createElement('tr');
            const mcap = coin.market_cap;
            const number = Number(mcap); 
            let fmcap = '';
            
            // Format based on the actual number value
            if (number >= 1000000000000) { // 1 trillion or more
                fmcap = (number / 1000000000000).toFixed(1) + 'T'; // Trillion
            } else if (number >= 1000000000) { // Billions
                fmcap = (number / 1000000000).toFixed(3) + 'B'; // No fixed decimal, just toString()
            } else if (number >= 1000000) { // Millions
                fmcap = (number / 1000000).toFixed(3) + 'M'; 
            }

            // Price change logic
            let priceChange = coin.price_change_percentage_24h;
            let changeSymbol = priceChange >= 0 ? '' : '';
            let color = priceChange >= 0 ? '#00fa11' : '#fa0000'; // Green for up, red for down
            let svgPath = priceChange >= 0 ? 
                '<path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path>' :
                '<path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z" transform="rotate(180 165 165)"></path>';

            let priceChangeHtml = `<td>
                <svg fill="${color}" height="15" width="15" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="${color}">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        ${svgPath}
                    </g>
                </svg> ${changeSymbol}${Math.abs(priceChange).toFixed(1)}%
            </td>`;

            // Alert icon logic
            watchIcon = `
                <td>
                    <svg fill="#be00ff" height="30" width="30" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 310.285 310.285" xml:space="preserve" stroke="#be00ff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M155.143,0.001C69.597,0.001,0,69.597,0,155.143c0,85.545,69.597,155.142,155.143,155.142s155.143-69.597,155.143-155.142 C310.285,69.597,240.689,0.001,155.143,0.001z M244.143,171.498c0,4.411-3.589,8-8,8h-163c-4.411,0-8-3.589-8-8v-32 c0-4.411,3.589-8,8-8h163c4.411,0,8,3.589,8,8V171.498z"></path> </g></svg>
                </td>`;
         
        
            watchRow.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${coin.name}</td>
                <td>${coin.symbol.toUpperCase()}</td>
                <td>$${coin.current_price}</td>
                ${priceChangeHtml}
                <td>${fmcap}</td>
                <td><img src="${coin.image}" alt="${coin.name}" width="30" id="coinImg"></td>
                <td><a class="a-watch" href="/watchlist/remove/${coin.id}"${watchIcon}</a></td>
            `;
            document.getElementById('watchTableBody').appendChild(watchRow);
        });
    })
    .catch(err => console.error('Error fetching data:', err));
}

updateData();
globalData();
trendingCoin();
watchlistData();
setInterval(updateData, 3 * 60 * 1000); // Every 3 minutes
