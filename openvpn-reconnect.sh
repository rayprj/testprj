#!/bin/bash
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin


#read -p "Select the host: " host

function getStatus () {
        ifconfig | grep $1 && return 1
        return 0
}

while [[ 1 ]]; do
        getStatus tun0
        if [[ $? == 0 ]]; then
                echo "openvpn is not connected!"
                echo "Reconnecting!"
                #Replace your_sudo_password to your real user sudo password.
                echo $1 | sudo -S openvpn --config $2
                echo $1 | sudo -S echo nameserver 208.67.222.222 > /etc/resolv.conf
                echo $1 | sudo -S echo nameserver 208.67.220.220 > /etc/resolv.conf
                sleep 6
        fi
        sleep 6
done