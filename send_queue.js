class SendQueue {
  static TICKER_DURATION = 100

  constructor() {
    this.queues = {}
    this.start()
  }

  async start() {
    while (true) {
      const ps = []
      for (const key in this.queues) {
        if (!Object.prototype.hasOwnProperty.call(this.queues, key)) {
          continue
        }

        const item = this.queues[key]
        if (item.consumer) {
          const itemData = item.datas.pop()
          if (!itemData) {
            continue
          }

          const promise = async () => {
            try {
              let result = undefined
              if (item.consumer) {
                result = await item.consumer(itemData.value)
              }
              itemData.callback && itemData.callback(undefined, result)
            } catch (error) {
              itemData.callback && itemData.callback(error, undefined)
            }
          }
          ps.push(promise())
        }
      }

      await Promise.all(ps)

      await this.sleep()
    }
  }

  sleep() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), SendQueue.TICKER_DURATION)
    })
  }

  initQueuesKey(key) {
    if (!this.queues[key]) {
      this.queues[key] = { datas: [] }
    }
  }

  produce(key, data) {
    this.initQueuesKey(key)
    this.queues[key].datas.unshift(data)
  }

  registerConsumer(key, consumer) {
    this.initQueuesKey(key)
    this.queues[key]['consumer'] = consumer
  }
}

module.exports = {
  SendQueue,
}
