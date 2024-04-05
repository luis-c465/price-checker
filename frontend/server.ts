const USE_BACKEND = false

const SERVER_URL = "idk"
export type ImageSearch = {
  text: string
  url: string
}
type ImageSearchResponse = {
  "proudcts": ImageSearch[]
}

type EncodedImage = {
  uri: string,
  type: "image/jpeg",
  name: string
}

export  async function getImageSearchResponseBackend(images: string[]) {
  const formData = new FormData()

  const encodedImages  = images.map((img, i) => ({
    uri: img,
    type: "image/jpeg",
    name: `${i}.jpeg`
  } as EncodedImage))

  encodedImages.forEach((img, i) => {
    formData.append(`photo${i}`, img as any)
  })

  const xhr = new XMLHttpRequest();

  const res =new Promise<ImageSearchResponse>((res, rej) => {
    xhr.onload = () => {
      res(JSON.parse(xhr.responseText) as ImageSearchResponse)
    }

    xhr.onerror = () => {
      rej(xhr.status)
    }
  })
  xhr.open('POST', `${SERVER_URL}/images`);
  xhr.send(formData);

  return res
}


export async function getImageSearchResponse(images: string[]): Promise<ImageSearchResponse> {
  if (USE_BACKEND) {
    return getImageSearchResponse(images)
  } else {
    return new Promise((res) => {
      res(dummyImageSearchResponse)
    })
  }
}
const dummyImageSearchResponse: ImageSearchResponse = {
  proudcts: [

  {
    "text": "MacBook Pro 11",
    "url": "https://tse4.mm.bing.net/th?q=MacBook+Pro+11&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate.png"
  },
  {
    "text": "MacBook Pro 13 Charger",
    "url": "https://tse4.mm.bing.net/th?q=MacBook+Pro+13+Charger&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro Retina",
    "url": "https://tse3.mm.bing.net/th?q=MacBook+Pro+Retina&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro 13 Ports",
    "url": "https://tse4.mm.bing.net/th?q=MacBook+Pro+13+Ports&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "14 in MacBook Pro",
    "url": "https://tse2.mm.bing.net/th?q=14+in+MacBook+Pro&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro 12",
    "url": "https://tse3.mm.bing.net/th?q=MacBook+Pro+12&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "Apple MacBook Pro",
    "url": "https://tse4.mm.bing.net/th?q=Apple+MacBook+Pro&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "New MacBook Pro",
    "url": "https://tse4.mm.bing.net/th?q=New+MacBook+Pro&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro 2",
    "url": "https://tse2.mm.bing.net/th?q=MacBook+Pro+2&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro I5",
    "url": "https://tse2.mm.bing.net/th?q=MacBook+Pro+I5&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "Apple MacBook Pro 13.3",
    "url": "https://tse3.mm.bing.net/th?q=Apple+MacBook+Pro+13.3&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro 1",
    "url": "https://tse1.mm.bing.net/th?q=MacBook+Pro+1&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "Mac Laptop",
    "url": "https://tse2.mm.bing.net/th?q=Mac+Laptop&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook 13-Inch",
    "url": "https://tse2.mm.bing.net/th?q=MacBook+13-Inch&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro 18",
    "url": "https://tse1.mm.bing.net/th?q=MacBook+Pro+18&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "First MacBook Pro",
    "url": "https://tse2.mm.bing.net/th?q=First+MacBook+Pro&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "Original MacBook Pro",
    "url": "https://tse1.mm.bing.net/th?q=Original+MacBook+Pro&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook 15 Inch",
    "url": "https://tse3.mm.bing.net/th?q=MacBook+15+Inch&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro 16",
    "url": "https://tse3.mm.bing.net/th?q=MacBook+Pro+16&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Air Pro",
    "url": "https://tse4.mm.bing.net/th?q=MacBook+Air+Pro&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "Latest MacBook",
    "url": "https://tse4.mm.bing.net/th?q=Latest+MacBook&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Case",
    "url": "https://tse1.mm.bing.net/th?q=MacBook+Case&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "Apple MacBook Pro 17 Inch",
    "url": "https://tse2.mm.bing.net/th?q=Apple+MacBook+Pro+17+Inch&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro Front",
    "url": "https://tse1.mm.bing.net/th?q=MacBook+Pro+Front&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro Box",
    "url": "https://tse3.mm.bing.net/th?q=MacBook+Pro+Box&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro Retina Display",
    "url": "https://tse1.mm.bing.net/th?q=MacBook+Pro+Retina+Display&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Pro Keyboard",
    "url": "https://tse1.mm.bing.net/th?q=MacBook+Pro+Keyboard&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Touch Screen",
    "url": "https://tse2.mm.bing.net/th?q=MacBook+Touch+Screen&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "MacBook Unibody",
    "url": "https://tse3.mm.bing.net/th?q=MacBook+Unibody&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  },
  {
    "text": "Refurbished MacBook Pro",
    "url": "https://tse3.mm.bing.net/th?q=Refurbished+MacBook+Pro&pid=Api&mkt=en-US&cc=US&setlang=en&adlt=moderate"
  }

  ]
}
