# Home Network Monitor
![Screenshot of HNM](/hnm-screen.png)

Simple ANSI screen driven Network Monitor for Home Networks/Labs

This is a very simple Network Monitor that I use for my home network and lab.  It uses ANSI codes inside a terminal session and lists all the configured network nodes and either a green 'UP', a red 'DOWN', or a blue unknown status.

There are five different tests that can be done:\
  ping\
  http\
  https\
  dns query\
  WordPress query\
  External Command

The External Command will execute whatever command string you put into the config.json file, and if it returns ANY text, it will assume that the tested node is UP...if it returns nothing, then its DOWN.
I have placed a number of external programs that I use for my networks in the 'agents' folder.

The WordPress query does a GET to "https://{fqdn}/wp-admin" and looks for a 301 or 302 redirect status code. My thinking here is that I don't want to push the website statistics up by repeatedly grabbing a page off the website, so I query for something that would respond with a status code that I could check for and not be counted by my analytics.  It seems to be working so far, but I have only been running it for a few days now (Feb. 2020)...if it messes up my access counts, I'll come back and update the README.
