import os
import glob
import sys
files = glob.glob(sys.argv[1] + os.path.sep + 'win_*.dll')
files.extend(glob.glob(sys.argv[1] + os.path.sep + 'mac_*.dylib'))
for file in files:
    os.rename(file, sys.argv[1] + os.path.sep + format(file.rsplit('_')[1]))
    print(file)
    print(sys.argv[1] + os.path.sep + format(file.rsplit('_')[1]))