# adding linux swap
sudo dd if=/dev/zero of=/swapfile bs=1MB count=1024
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
vim /etc/fstab
/swapfile swap swap defaults 0 0