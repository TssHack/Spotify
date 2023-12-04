const express = require('express');
const cors = require("cors");
const axios = require('axios');

const app = express();

app.use(cors());

/*

Dev : @man_khodam_khodam
Channel : @StealthySolutions

*/


app.get('/info', async (req, res) => {
    const type = req.query.type;
    const id = req.query.id;
    const link = req.query.link;

    if (!type || (!id && type === 'manual') || (!link && type === 'automatic')) {
        const error = {
            error: true,
            message: "Invalid or incomplete request. Make sure to provide 'type', 'id' (for manual), and 'link' (for automatic)."
        };
        res.json(error);
    } else {
        if (type === 'manual' && !id) {
            const error = {
                error: true,
                message: "For manual type, 'id' parameter is required."
            };
            res.json(error);
        } else if (type === 'automatic' && !link) {
            const error = {
                error: true,
                message: "For automatic type, 'link' parameter is required."
            };
            res.json(error);
        } else {
            let spotifyId;

            if (type === 'automatic') {
                const pattern = /\/track\/([a-zA-Z0-9]+)\?/;
                const matches = link.match(pattern);
                spotifyId = matches[1];
            } else {
                spotifyId = id;
            }

            const url = `https://api.spotifydown.com/download/${spotifyId}`;

            const headers = {
                "authority": "api.spotifydown.com",
                "accept": "*/*",
                "accept-language": "fa-NL,fa;q=0.9,en-NL;q=0.8,en;q=0.7,en-US;q=0.6",
                "origin": "https://spotifydown.com",
                "referer": "https://spotifydown.com/",
                "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
            };

            try {
                const response = await axios.get(url, { headers });
                const data = response.data;

                if (response.status !== 200 || !data.success) {
                    const error = {
                        error: true,
                        message: "Invalid request or something went wrong."
                    };
                    res.json(error);
                } else {
                    const responseData = data.metadata;

                    const formattedResponse = {
                        error: false,
                        link: {
                            cover: responseData.cover,
                            download: data.link
                        },
                        info: {
                            artists: responseData.artists,
                            title: responseData.title,
                            album: responseData.album,
                            isrc: responseData.isrc,
                            releaseDate: responseData.releaseDate,
                            id: responseData.id
                        }
                    };

                    res.json(formattedResponse);
                }
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: "An error occurred while processing the request."
                };
                res.json(errorMessage);
            }
        }
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
