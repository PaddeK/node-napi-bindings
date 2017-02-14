import os
import glob
import sys
files = glob.glob(sys.argv[1] + '[mac_|win_]*[dylib|dll]')
for file in files:
    os.rename(file, sys.argv[1] + format(file.split('_')[1]))
