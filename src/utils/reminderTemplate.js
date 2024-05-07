export const reminderTemplate = ({subject}) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Elagek Dlwakty</title>
        <style>
            /* CSS styles */
            body {
                background-color: #003F5F;
                width: 100%;
                height: 100%;
                text-align: center;
                align-items: center;
                margin: 0;
                padding: 0;
            }

            .container {
                /* Additional styles for container */
            }

            .reminder {
                font-family: 'Arial', sans-serif;
                font-size: 18px;
                color: white;
                margin-bottom: 20px;
            }

            .cont {
                margin-top: 20px;
            }

            .text {
                color: white;
                font-family: 'Arial', sans-serif;
                font-size: 18px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="img/icon only 3.png" />
            <img src="img/text only 1.png" />
        </div>
        <div class="reminder">
            <h2>Now!  your Dose of ${subject} </h2>
        </div>
        <div class="cont">
            <p class="text">50% of people forget to take their medicines, be from the other half</p>
        </div>
    </body>
    </html>`;
}

