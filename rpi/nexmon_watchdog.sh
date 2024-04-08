#!/usr/bin/env bash
set -euo pipefail
red= #$(tput setaf 1)
green= #$(tput setaf 2)
yellow= #$(tput setaf 3)
reset= #$(tput sgr0)

if ! [ $(id -u) = 0 ]; then
   echo ${red}"need to run this as root!${reset}"
   exit 1
fi

echo "${yellow}patiently waiting for nexmon blindness error (https://github.com/evilsocket/pwnagotchi/issues/267)..${reset}"
tail -n 0 -f /var/log/kern.log | while read -r kernel_log_line; do
	if [[ $kernel_log_line == *"brcmf_cfg80211_nexmon_set_channel: Set Channel failed"* || $kernel_log_line == *"brcmf_cfg80211_get_tx_power: error"* || $kernel_log_line == *"brcmf_proto_bcdc_query_dcmd: brcmf_proto_bcdc_msg failed"* ]]; then
		echo "${red}caught blindness error, reloading nexmon driver..${reset}"
		set -x
		echo -n "mmc1:0001:1" > /sys/bus/sdio/drivers/brcmfmac/unbind
		sleep 1
		echo -n "mmc1:0001:2" > /sys/bus/sdio/drivers/brcmfmac/unbind
		sleep 3
		echo -n "mmc1:0001:1" > /sys/bus/sdio/drivers/brcmfmac/bind
		sleep 3
		echo -n "mmc1:0001:2" > /sys/bus/sdio/drivers/brcmfmac/bind
		sleep 3
		modprobe brcmfmac #this modprobe may not be needed, but it seems to help sometimes.
		sleep 3
		#running a couple extra binds here in case the modprobe made a difference. it can't hurt!
		echo -n "mmc1:0001:1" > /sys/bus/sdio/drivers/brcmfmac/bind || true
		sleep 3
		echo -n "mmc1:0001:2" > /sys/bus/sdio/drivers/brcmfmac/bind || true
		sleep 3
		iw dev wlan0 interface add mon0 type monitor
		sleep 3
		ifconfig mon0 up
		set +x
		date
		echo "${green}nexmon driver reloaded and mon0 brought back up! looping until next error..${reset}"
	fi
done