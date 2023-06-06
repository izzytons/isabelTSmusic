// Get DR Gigs
export async function GetGigs(band){
    const response = await fetch(`https://gig-api.netlify.app/.netlify/functions/api/gigs/${band}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "Access-Control-Request-Headers": "*",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Allow-Credentials": "true",
                        "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS"
                    }}).then((fetchResponse) => {
                        const gigs = fetchResponse.json();
                        return gigs;
                    });  

    return response;
}

export async function CreateGig(newGig, band){
    const response = await fetch(`https://gig-api.netlify.app/.netlify/functions/api/gigs/${band}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "Access-Control-Request-Headers": "*",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Allow-Credentials": "true",
                        "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS"
                    },
                    body: JSON.stringify(newGig)
                    }).then((fetchResponse) => {
                        const responseCode = fetchResponse.status;
                        if (responseCode === 201){
                            return true;
                        }
                        else{
                            return false;
                        }
                    });  

    return response;
}

export async function UpdateGig(gigId, updatedGig, band){
    const response = await fetch(`https://gig-api.netlify.app/.netlify/functions/api/gigs/${band}/${gigId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Access-Control-Request-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS"
        },
        body: JSON.stringify(updatedGig)
        }).then((fetchResponse) => {
            const responseCode = fetchResponse.status;
            if (responseCode === 200){
                return true;
            }
            else{
                return false;
            }
        });  

    return response;
}

export async function DeleteGig(gigId, band){
    const response = await fetch(`https://gig-api.netlify.app/.netlify/functions/api/gigs/${band}/${gigId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Access-Control-Request-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS"
        }}).then((fetchResponse) => {
            const responseCode = fetchResponse.status;
            if (responseCode === 200){
                return true;
            }
            else{
                return false;
            }
        });  

    return response;
}


