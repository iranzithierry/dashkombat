git clone --no-checkout https://github.com/iranzithierry/click-it
cd click-it
git sparse-checkout init --cone
git sparse-checkout set server
cd /home/click-it/htdocs/click-it.ebuzzie.com/click-it/server