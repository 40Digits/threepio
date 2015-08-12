# threepio

> Developer-Environment relations

__Asynchronously set up your local environment.__

## Installation

`$ npm i threepio -g`

## Configuration -- Priority

There are many ways to configure threepio, from a 'global' configuration json file to options passed directly into the commands you run.

The priority of configuration is listed below, from least to greatest priority.

1. The default configuration, as shown below. Additional configuration isn't necessary, but more than likely you'll need a global configuration file.

2. A global JSON configuration dot file in your home directory, `~/.threepio`.

3. A local JSON configuration dot file, `.threepio`, located in your current working directory.

4. Options passed directly into the tasks you run. Available options are listed below. Simply append either a `-` or `--` to the option key, such as `$ threepio mysql --database deathstar`. See example usage below for more on this configuration method.

Using multiple configuration locations is recommended for a more pleasurable experience as some things may never change, such as your MySQL username/password or vhost directory.

**Note**: Both the global and local `.threepio` files are expected to be vanilla JSON.

## Options

To make setting up environments easier, threepio leverages Embedded JavaScript templates, or EJS, to make the process more dynamic, which in turn requires less setup and configuration on your part. Include EJS syntax in any option that's a string along with any configuration key as a variable and it will be rendered for you.

<table>
  <tr>
    <th>Option Key</th>
    <th>Default Value</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>siteName</code></td>
    <td>Your current working directory name (sanitized with special characters replaced with a dash (<code>-</code>) and lowercased)</td>
    <td>This is the "name" of your site as it relates to various development components. This name is used to create the local url, database, Apache log names and vhost filename.</td>
  </tr>
  <tr>
    <td><code>localUrl</code></td>
    <td><code>'<%= siteName %>.local'</code></td>
    <td>This is the name of your local url which is rendered with EJS using <code>siteName</code> as the domain.</td>
  </tr>
  <tr>
    <td><code>baseDirectory</code></td>
    <td>Your current working directory</td>
    <td>This value is used to create your VirtualHost directory. **Note**: This value is set separately from <code>siteName</code>. Although they both default to the current working directory, this is the full path and <code>siteName</code> is just the directory name itself.</td>
  </tr>
  <tr>
    <td><code>database</code></td>
    <td>A sanitized version of <code>siteName</code> with special characters replaced with an underscore (<code>'_'</code>) and lowercased</td>
    <td>The name to give the created database</td>
  </tr>
  <tr>
    <td><code>hostsFile</code></td>
    <td><code>'/etc/hosts'</code></td>
    <td>The absolute filepath of your hosts file</td>
  </tr>
  <tr>
    <td><code>httpPort</code></td>
    <td><code>80</code></td>
    <td>The port number used in the opening tag of your VirtualHost conf</td>
  </tr>
  <tr>
    <td><code>vhostsDir</code></td>
    <td><code>'/etc/apache2/extra/vhosts'</code></td>
    <td>The directory to include a vhost <code>.conf</code> file.</td>
  </tr>
  <tr>
    <td><code>customLog</code></td>
    <td><code>'/http-logs/<%= siteName %>.log'</code></td>
    <td>The filename and absolute path of your Apache custom log file.</td>
  </tr>
  <tr>
    <td><code>errorLog</code></td>
    <td><code>'/http-logs/<%= siteName %>.error.log'</code></td>
    <td>The filename and absolute path of your Apache error log file.</td>
  </tr>
  <tr>
    <td><code>mysqlUser</code></td>
    <td><code>'root'</code></td>
    <td>Your MySQL username</td>
  </tr>
  <tr>
    <td><code>mysqlPw</code></td>
    <td><code>''</code></td>
    <td>Your MySQL password</td>
  </tr>
  <tr>
    <td><code>apache24</code></td>
    <td><code>true</code></td>
    <td>When using Apache 2.4, you may experience a 403 when visiting the newly created url. This adds a <a href="http://stackoverflow.com/questions/6959189/Apache-virtualhost-403-forbidden#answer-13923435">directive</a> to the vhosts that fixes the issue if you do not have it changed in your global `httpd.conf` file.</td>
  </tr>
  <tr>
    <td><code>templateDir</code></td>
    <td>None</td>
    <td>The directory to any templates used with this package, such as the template used to create a vhost <code>.conf</code> file.</td>
  </tr>
</table>

### Sample Configuration Usage

Here are some sample configuration usages going from lowest priority to highest priority in their values.

#### Method 1: No custom configuration

If you like the defaults, then there's not reason to use any other configuration methods. It is recommended that if you do use a local configuration dot file (`.threepio`) that be added to your `.gitignore` since everyone typically has their own local environment style.

#### Method 2: Global Configuration dot file

This is a file located in your home directory and named `.threepio` (aka `~/.threepio`). This is a plain vanilla JSON file.

```
{
  "localUrl": "<%= siteName %>.dev",
  "customLog": "/Users/me/www/logs/<%= siteName %>.log",
  "errorLog": "/Users/me/www/logs/<%= siteName %>.error.log",
  "mysqlPw": "the-force-is-strong-with-this-one"
}
```

#### Method 3: Local Configuration dot file

"Local" in this instance means a dot file in your current working directory, which is more than likely the repo base directory. This is also vanilla JSON.

```
{
  "siteName": "r2d2",
  "database": "yavin4"
}
```

#### Method 3: Options passed to the cli

These option values are give the highest priority.

```
$ threepio open hosts --localUrl othersite.local --hostsFile /etc/apache/hosts
```

## Usage :rooster::dash:

The intended use of threepio is globally. There is no need to add it to your `package.json`; the global installation should suffice.

A common use case for threepio would be a new Wordpress install. After downloading/cloning a new installation, there are certain things you need to do:

- Create a MySQL database
- Create `wp-config.php`
- Set up a vhost
- Update your hosts file with your inteded local url
- Rename the theme directory (depending on your typical dev process)
- Restart Apache
- Open that url in the browser and finish the installation

Wow, that's a lot of stuff. Albeit not too difficult or time-consuming, but the process can get a little dry. Enter threepio.

You would use threepio as soon as you downloaded a new WP install or forked and cloned a boilerplate like we do at 40digits. Instead of doing all that, you could set up some simple configuration as mentioned above and run something like this:

```
$ threepio mysql wp-config hosts vhosts wp-theme restart-apache open
```

This would do everything you need in seconds, saving you some time.

While putting in individual commands isn't too bad, the above example is nearing cumbersome. Instead, you could use a workflow.

### Workflows

Using the same Wordpress use case, let's say you've forked and cloned a boilerplate. What if that boilerplate also included `threepio.json` that had all of those tasks specified? Then you could run

```
$ sudo threepio
```

That's it. All that `threepio.json` file has is a JSON array of the tasks you need to run. Keep in mind that you need to run that command with `sudo` permissions due to editing the hosts file and resetting Apache.

```
[
  "mysql",
  "wp-config",
  "hosts",
  "vhost",
  "wp-theme",
  "restart-apache",
  "open"
]
```

Putting those 95 bytes with the repo would be even simpler.

## Available tasks

Run `$ threepio -h` or `$ threepio --help` to see your current installation's available tasks. The idea is that this will be regularly updated, adding more available tasks to make the mundane a little less mundane.

This command will also show you some example usages and what the current configuration settings would be if you ran a task. This is helpful in case you're not sure if you have everything configured correctly.

## Contributing

If you'd like to add a new task, great! Included in the root directory is `_task-template.js` to help get you started. There are a few requirements for your task to build threepio's vocabulary.

Your task's export must be an object with both a `description` property (used when `$ threepio -h` is ran) and a `task` function (which is where the action is), which has config and a callback from the `taskRunner` module (which is just a message saying the task is complete).

```
module.exports = {

  description: 'Your awesome module description here',

  task: function (config, callback) {
    // Your task stuff here
  }
};
```

## Considerations

If the Apache log paths don't exist, you'll get weird behavior. So make sure those are valid paths by ensuring the default are adequete or use a global configuration setting defined in `~/.threepio`. :feels_good:
