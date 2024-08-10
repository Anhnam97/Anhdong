#!/bin/bash

red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
plain='\033[0m'

cur_dir=$(pwd)

# check root
[[ $EUID -ne 0 ]] && echo -e "${red}Fatal error: ${plain} Please run this script with root privilege \n " && exit 1

# Check OS and set release variable
if [[ -f /etc/os-release ]]; then
    source /etc/os-release
    release=$ID
elif [[ -f /usr/lib/os-release ]]; then
    source /usr/lib/os-release
    release=$ID
else
    echo "Failed to check the system OS, please contact the author!" >&2
    exit 1
fi
echo "The OS release is: $release"

arch3xui() {
    case "$(uname -m)" in
    x86_64 | x64 | amd64) echo 'amd64' ;;
    armv8* | armv8 | arm64 | aarch64) echo 'arm64' ;;
    armv7* | armv7 | arm) echo 'armv7' ;;
    armv6* | armv6 | arm) echo 'armv6' ;;
    *) echo -e "${green}Unsupported CPU architecture! ${plain}" && rm -f install.sh && exit 1 ;;
    esac
}
echo "arch: $(arch3xui)"

os_version=""
os_version=$(grep -i version_id /etc/os-release | cut -d \" -f2 | cut -d . -f1)

if [[ "${release}" == "centos" ]]; then
    if [[ ${os_version} -lt 8 ]]; then
        echo -e "${red} Please use CentOS 8 or higher ${plain}\n" && exit 1
    fi
elif [[ "${release}" == "ubuntu" ]]; then
    if [[ ${os_version} -lt 20 ]]; then
        echo -e "${red} Please use Ubuntu 20 or higher version!${plain}\n" && exit 1
    fi

elif [[ "${release}" == "fedora" ]]; then
    if [[ ${os_version} -lt 36 ]]; then
        echo -e "${red} Please use Fedora 36 or higher version!${plain}\n" && exit 1
    fi

elif [[ "${release}" == "debian" ]]; then
    if [[ ${os_version} -lt 11 ]]; then
        echo -e "${red} Please use Debian 11 or higher ${plain}\n" && exit 1
    fi

elif [[ "${release}" == "almalinux" ]]; then
    if [[ ${os_version} -lt 9 ]]; then
        echo -e "${red} Please use AlmaLinux 9 or higher ${plain}\n" && exit 1
    fi

elif [[ "${release}" == "rocky" ]]; then
    if [[ ${os_version} -lt 9 ]]; then
        echo -e "${red} Please use RockyLinux 9 or higher ${plain}\n" && exit 1
    fi
elif [[ "${release}" == "arch" ]]; then
    echo "Your OS is ArchLinux"
elif [[ "${release}" == "manjaro" ]]; then
    echo "Your OS is Manjaro"
elif [[ "${release}" == "armbian" ]]; then
    echo "Your OS is Armbian"
else
    echo -e "${red}Failed to check the OS version, please contact the author!${plain}" && exit 1
fi

install_base() {
    case "${release}" in
        centos|fedora|almalinux|rocky)
            yum -y update && yum install -y -q wget curl tar
            ;;
        arch|manjaro)
            pacman -Syu && pacman -Syu --noconfirm wget curl tar
            ;;
        *)
            apt-get update && apt install -y -q wget curl tar
            ;;
    esac
}

# This function will be called when user installed x-ui out of security
config_after_install() {
    echo -e "${yellow}Install/update finished! For security it's recommended to modify panel settings ${plain}"
    read -p "Do you want to continue with the modification [y/n]? " config_confirm
    if [[ "${config_confirm}" == "y" || "${config_confirm}" == "Y" ]]; then
        read -p "Please set up your username: " config_account
        echo -e "${yellow}Your username will be: ${config_account}${plain}"
        read -p "Please set up your password: " config_password
        echo -e "${yellow}Your password will be: ${config_password}${plain}"
        read -p "Please set up the panel port: " config_port
        echo -e "${yellow}Your panel port is: ${config_port}${plain}"
        echo -e "${yellow}Initializing, please wait...${plain}"
        /usr/local/x-ui/x-ui setting -username ${config_account} -password ${config_password}
        echo -e "${yellow}Account name and password set successfully!${plain}"
        /usr/local/x-ui/x-ui setting -port ${config_port}
        echo -e "${yellow}Panel port set successfully!${plain}"
    else
        echo -e "${red}cancel...${plain}"
        if [[ ! -f "/etc/x-ui/x-ui.db" ]]; then
            local usernameTemp=$(head -c 6 /dev/urandom | base64)
            local passwordTemp=$(head -c 6 /dev/urandom | base64)
            /usr/local/x-ui/x-ui setting -username ${usernameTemp} -password ${passwordTemp}
            echo -e "this is a fresh installation, will generate random login info for security concerns:"
            echo -e "###############################################"
            echo -e "${green}username: ${usernameTemp}${plain}"
            echo -e "${green}password: ${passwordTemp}${plain}"
            echo -e "###############################################"
            echo -e "${red}if you forgot your login info, you can type x-ui and then type 7 to check after installation${plain}"
        else
            echo -e "${red} this is your upgrade, will keep old settings, if you forgot your login info, you can type x-ui and then type 7 to check${plain}"
        fi
    fi
    /usr/local/x-ui/x-ui migrate
}

install_x-ui() {
    cd /usr/local/

    if [ $# -eq 0 ]; then
        version="2.1.3"  # Thay đổi phiên bản theo nhu cầu của bạn
        url="https://github.com/Anhnam97/Anhdong/raw/main/x-ui-linux-$(arch3xui)-V${version}.tar.gz"
        echo -e "Downloading x-ui version ${version}"
    else
        version="$1"
        url="https://github.com/Anhnam97/Anhdong/raw/main/x-ui-linux-$(arch3xui)-V${version}.tar.gz"
        echo -e "Downloading x-ui version ${version}"
    fi

    wget -N --no-check-certificate -O /usr/local/x-ui-linux-$(arch3xui)-$version.tar.gz ${url}
    if [[ $? -ne 0 ]]; then
        echo -e "${red}Download x-ui version $version failed, please check if the version exists ${plain}"
        exit 1
    fi

    if [[ -e /usr/local/x-ui/ ]]; then
        systemctl stop x-ui
        rm /usr/local/x-ui/ -rf
    fi

    tar zxvf x-ui-linux-$(arch3xui)-$version.tar.gz
    rm x-ui-linux-$(arch3xui)-$version.tar.gz -f
    cd x-ui
    chmod +x x-ui

    # Check the system's architecture and rename the file accordingly
    if [[
