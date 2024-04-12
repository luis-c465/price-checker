import axios, { AxiosRequestConfig } from "axios";
import { ProductData } from "./app/ProductLister/ProductBox";
import { bottlesImageSearchResponse, defaultProductsData } from "./default";

const USE_BACKEND = false;
const SERVER_URL = "http://10.110.229.147:5001";
export type ImageSearch = {
  text: string;
  url: string;
};
export type ImageSearchResponse = {
  products: ImageSearch[];
};

type EncodedImage = {
  uri: string;
  type: "image/jpeg";
  name: string;
};
const ax = axios.create({
  baseURL: SERVER_URL,
  timeout: 100_000,
});

export async function getImageSearchResponseBackend(images: string[]) {
  console.log(images);
  const formData = new FormData();

  const encodedImages = images.map(
    (img, i) =>
      ({
        uri: img,
        type: "image/jpeg",
        name: `${i}.jpg`,
      }) as EncodedImage,
  );

  encodedImages.forEach((img, i) => {
    formData.append(`photo${i}`, img as any);
  });

  const config: AxiosRequestConfig = {
    method: "post",
    url: "/images",
    responseType: "json",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: () => {
      return formData;
    },
    data: formData,
  };

  const data = await ax.request<ImageSearchResponse>(config);
  return data.data;
}

export async function getImageSearchResponse(
  images: string[],
): Promise<ImageSearchResponse> {
  if (USE_BACKEND) {
    return getImageSearchResponseBackend(images);
  } else {
    return new Promise((res) => {
      res(bottlesImageSearchResponse);
    });
  }
}

// PRODUCT SEARCH

type ProductSearchResponse = {
  name: string;
  products: ProductData[];
};

export async function getProductSearchResponse(
  query: string,
): Promise<ProductSearchResponse> {
  if (USE_BACKEND) {
    const config: AxiosRequestConfig = {
      method: "get",
      url: "/search",
      responseType: "json",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        query,
      },
    };
    const req = await ax.request<ProductSearchResponse>(config);
    return req.data;
  } else {
    return { name: "misc", products: defaultProductsData };
  }
}
