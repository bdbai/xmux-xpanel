interface INews {
  imageURL: {
    lang: {
      en_US: string,
      zh_CN: string
    }
  },
  name: {
    lang: {
      en_US: string,
      zh_CN: string
    }
  },
  isWebPage: boolean,
  uri: string
}

export default INews
