/*eslint @typescript-eslint/no-explicit-any: "off"*/
import { ClientConfig, PubSub } from "@google-cloud/pubsub";
import { logger } from "../configLog";

class PubSubFactory {
  private projectId: string;
  private keyFile: string;
  private clientConfigOptions: ClientConfig;
  private pubSubClient: PubSub;

  public async connect() {
    this.pubSubClient = new PubSub(this.clientConfigOptions);
  }

  public async subscribe(
    suscribeName: string,
    messageHandler: any,
    errorHandler: any = null
  ) {
    const subscription = this.pubSubClient.subscription(suscribeName);

    subscription.on("message", messageHandler);
    if (errorHandler != null) {
      subscription.on("error", errorHandler);
    }
  }

  public isConnected() {
    return this.pubSubClient.isOpen;
  }

  public async unsubscribe(suscribeName: string, messageHandler: any) {
    const subscription = this.pubSubClient.subscription(suscribeName);
    subscription.removeListener("message", messageHandler);
  }

  public async publishMessage(
    message: string,
    topicName: string,
    orderingKey: string
  ) {
    const data = Buffer.from(message);
    try {
      const messageId = await this.pubSubClient
        .topic(topicName, { messageOrdering: true })
        .publishMessage({ data, orderingKey });
      return messageId;
    } catch (error) {
      logger.error(`Ha ocurrido un error al generar el mensaje en la cola: ${error}`);
      process.exitCode = 1;
    }
  }

  public async publishCustomMessage(
    message: string,
    topicName: string,
    customOptions: any
  ) {
    const data = Buffer.from(message);
    try {

     const {orderingKey , customAttributes} = customOptions;

      const messageId = await this.pubSubClient
        .topic(topicName, { messageOrdering: true })
        .publishMessage({ data, orderingKey, attributes: customAttributes });
      return messageId;
    } catch (error) {
      logger.error(`Ha ocurrido un error al generar el mensaje en la cola: ${error}`);
      process.exitCode = 1;
    }
  }

  public getClientConfigOptions() {
    return this.clientConfigOptions;
  }

  public setClientConfigOptions(keyFile: string, projectId: string) {
    this.clientConfigOptions = {
      keyFile,
      projectId,
    };
  }

  public getKeyfile() {
    return this.keyFile;
  }

  public setKeyfile(keyFile: string) {
    this.keyFile = keyFile;
  }

  public getProjectId() {
    return this.projectId;
  }

  public setProjectId(projectId: string) {
    this.projectId = projectId;
  }
}

export const pubSubFactory = new PubSubFactory();
