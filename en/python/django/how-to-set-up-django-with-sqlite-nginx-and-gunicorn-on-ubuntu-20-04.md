# How To Set Up Django with Sqlite, Nginx, and Gunicorn on Ubuntu 20.04

## Prerequisites and Goals

In order to complete this tutorial, you should have a fresh Ubunutu 20.04 server.

We will be installing Django within a virtual environment, or clone a project and
install requirements within a virtual environment.

### Our Steps

- Install packages which are needed on our project - Install Python we want to use -
  Update all packages and upgrade Ubuntu server
- Create a new user
- Create a virtual environment
- Create or clone a Django project
- Give read/write database and firewall permission
- Configure Gunicorn application server
- Configure Nginx web server
- Serve Django app

## Install Packages Which is Needed on the Project

### Install Python

I guess, Python3.8 cames installed with Ubuntu 20.04, but we can use other Python
versions in our project. In this title you learn how to install other Python version
download and install on your Ubuntu server.

Let’s get started.

You can download and install 3.6, 3.7, 3.8 and 3.9 versions of Python and tools we need
to using with Python as you can see below bash script.

```bash
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt -y upgrade
for version in 3.6 3.7 3.8 3.9
do
sudo apt install python$version
sudo apt install python$version-dev
sudo apt install python$version-venv
sudo apt install python$version-distutils
python$version -m pip install --upgrade pip
done
```

## Install Packages Which is Needed on the Project

To begin the process, we'll download and install all of the packages we need from Ubuntu
repositories.

```bash
sudo apt install nginx curl
sudo apt update
sudo apt -y upgrade

```

## Create A New User

I use my old Django project named [coogger](https://github.com/coogger/coogger), thus in
this title when I create a new user I use the name as a username.

`useradd` command to create a new user

```bash
sudo useradd coogger
```

Okay we create a new user in /home/coogger directory. Then we should give the user sudo
group privileges from sudo permission group.

Use the `usermod` command to give the sudo permission group

```bash
usermod -aG sudo coogger
```

Use the `su` command to swich to the coogger account from root.

```bash
su - coogger
```

## Creating a Python Virtual Environment for your Project
