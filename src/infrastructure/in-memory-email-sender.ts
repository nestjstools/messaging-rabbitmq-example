export class InMemoryEmailSender {
  async send(name: string): Promise<void> {
    console.log(`Sending email... for user ${name}`)
  }
}
