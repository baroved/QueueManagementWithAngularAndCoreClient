export class User {
    Name: string;
    QueueNum: number;
    CurrentTime: string;
  name: string;
  queueNum: number;
  currentTime: string;

    constructor(name: string, queueNum: number, currentTime: string) {
        this.Name = name;
        this.QueueNum = queueNum;
        this.CurrentTime = currentTime;
    }
}
