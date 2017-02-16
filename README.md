# feeds
Command line app to read/write feeds and repeaters.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
- Recent version of node
- Parity or Geth
```

### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
npm install -g ds-feeds
```

End with an example of getting some data out of the system or using it for a little demo

## Running the command line

ds-feeds allows you to manage feedbase and repeater feeds.

You just need to execute
```
ds-feeds feedbase|f <method> [args...]
```
or
```
ds-feeds repeater|r <method> [args...]
```

### List of commands

```
ds-feeds feedbase --help

inspect           [feedbaseId]
owner             [feedbaseId]
label             [feedbaseId]
timestamp         [feedbaseId]
expiration        [feedbaseId]
expired           [feedbaseId]
get               [feedbaseId]
tryGet            [feedbaseId]

claim             []
set               [feedbaseId, value, expiration]
set               [feedbaseId, value] (expiration = unlimited)
set_owner         [feedbaseId, ownerAddress]
set_label         [feedbaseId, labelText]
```

```
ds-feeds repeater --help

inspect           [repeaterId]
owner             [repeaterId]
label             [repeaterId]
minimumValid      [repeaterId]
feedsQuantity     [repeaterId]
get               [repeaterId]
tryGet            [repeaterId]
tryGetFeed        [repeaterId, feedPosition]
getFeedInfo       [repeaterId, feedPosition]

claim             [] (minimumValid = 1)
claim             [minimumValid]
set               [repeaterId, feedbaseAddress, feedbaseId] (adding new feedbase on repeater)
set               [repeaterId, feedPosition, feedbaseAddress, feedbaseId] (editing feedbase on repeater)
unset             [repeaterId, feedPosition]
set_owner         [id, ownerAddress]
set_label         [id, labelText]
set_minimumValid  [id, labelText]
```

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Mariano Conti** - *Initial work* - [GitHub Profile](https://github.com/nanexcool)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Heavily inspired (and code copy pasted) from [Feedbase](https://github.com/dapphub/feedbase)
* Inspiration
* etc
