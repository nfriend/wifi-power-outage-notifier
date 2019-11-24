# WiFi Power Outage Notifier

<a href="https://gitlab.com/nfriend/wifi-power-outage-notifier/pipelines" target="_blank"><img src="https://gitlab.com/nfriend/wifi-power-outage-notifier/badges/master/pipeline.svg" alt="GitLab build status"></a>

A [Lambda](https://aws.amazon.com/lambda/) function that sends alerts (through [IFTTT](https://ifttt.com/)) in the case of a WiFi or power outage.

<img src="./img/power.png" alt="The Wifi/Power Outage Notifier logo" width="200">

## How it works

This project consists of two Lambda functions:

1. `ping`: Records the current timestamp in a [DynamoDB database](https://aws.amazon.com/dynamodb/).
1. `checkForRecentPings`: Triggered periodically (every five minutes) using a [CloudWatch cron](https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html) and sends a mobile alert if no `ping` has been received in the last five minutes.

A device inside the network (for example, a [Raspberry Pi](https://www.raspberrypi.org/)) makes a request to the `ping` endpoint every two minutes.
