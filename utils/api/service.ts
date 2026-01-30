import { config } from "../../config"

async function getVideos() {
  const res = await fetch(config.API_URL + `/videos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getUser(credential: any) {
  const res = await fetch(`${config.API_URL}/auth/get-user/${credential}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  });
  return res.json()
}

async function getDocument(document: any) {
  const res = await fetch(`${config.API_URL}/auth/get-document/${document}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  });
  return res.json()
}

async function getCategories() {
  const res = await fetch(config.API_URL + `/texts/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getCourses() {
  const res = await fetch(config.API_URL + `/courses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getHomeCategories() {
  const res = await fetch(config.API_URL + `/texts/home/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getCampaigns() {
  const res = await fetch(config.API_URL + `/texts/home/campaigns`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getDealerships(coor?: any) {
  const res = await fetch(config.API_URL + `/offers?lat=${coor.lat}&lng=${coor.lng}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getDealershipById(id: any) {
  const res = await fetch(config.API_URL + `/offers/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getCollab() {
  const res = await fetch(config.API_URL + `/contact`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getOneCampaign(id: any) {
  const res = await fetch(config.API_URL + `/texts/home/campaigns/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getCampaignByDealershipId(id: any) {
  const res = await fetch(config.API_URL + `/texts/home/campaigns/dealership/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getCategoryContent(filter: string) {
  const res = await fetch(config.API_URL + `/texts/home/category/${filter}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getCategoryContentAlt(filter: string) {
  const res = await fetch(config.API_URL + `/texts/home/category/${filter}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getOneCategoryContent(id: any) {
  const res = await fetch(config.API_URL + `/texts/home/category/content/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getCategoryContentByUserId(id: any) {
  const res = await fetch(config.API_URL + `/texts/home/category/content/${id}/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getCategoryContentCustom(id: any, initialDate: Date, finalDate: Date) {
  try {
    const res = await fetch(config.API_URL + `/texts/home/category/content/${id}/dashboard/custom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'
      },
      body: JSON.stringify({
        initialDate,
        finalDate
      })
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch category content:', error);
    throw error;
  }
}

async function sentNotificationByLocation(id: any, loc: any) {
  try {
    const res = await fetch(config.API_URL + `/offers/notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'
      },
      body: JSON.stringify({
        userId: id,
        loc
      })
    });

    return await res.json();

  } catch (error) {
    console.error('Failed to fetch category content:', error);
    throw error;
  }
}

async function getVideoById(videoId: string) {
  const res = await fetch(config.API_URL + `/videos/${videoId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json()
}

async function getHomeVideo() {
  const res = await fetch(config.API_URL + `/videoHome`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "69420"
    },
  })
  return res.json();
}

const handleView = async (id: string) => {
  try {
    const response = await fetch(`${config.API_URL}/videos/${id}/campaign/view`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "69420"
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch view');
    }
  } catch (error) {
    console.error('Error fetching view:', error);
  }
}

const handleClick = async (id: string) => {
  try {
    const response = await fetch(`${config.API_URL}/videos/${id}/campaign/click`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "69420"
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch view');
    }
  } catch (error) {
    console.error('Error fetching view:', error);
  }
}

const handleSub = async (data: any) => {
  try {
    const response = await fetch(`${config.API_URL}/process_payment/save-sub`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "69420"
      },
      body: data
    });
    if (!response.ok) {
      throw new Error('Failed to fetch view');
    }
  } catch (error) {
    console.error('Error fetching view:', error);
  }
}

export {
  getVideos,
  getVideoById,
  getCategories,
  getHomeCategories,
  getCampaigns,
  getOneCampaign,
  getCategoryContent,
  getOneCategoryContent,
  handleView,
  getCategoryContentByUserId,
  handleClick,
  getCourses,
  getCategoryContentCustom,
  handleSub,
  getUser,
  getDocument,
  getHomeVideo,
  getDealerships,
  getDealershipById,
  getCollab,
  getCampaignByDealershipId,
  sentNotificationByLocation
}