interface IAnnouncement {
  detail: {
    lang: {
      en_US: string,
      zh_CN: string
    }
  },
  headline: {
    lang: {
      en_US: string,
      zh_CN: string
    }
  },
  timestamp: number,
  isWebPage: boolean,
  uri: string
}

export default IAnnouncement
