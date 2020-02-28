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
  External Command\

The External Command will execute whatever command string you put into the config.json file, and if it returns ANY text, it will assume that the tested node is UP...if it returns nothing, then its DOWN.
I have placed a number of external programs that I use for my networks in the 'agents' folder.
