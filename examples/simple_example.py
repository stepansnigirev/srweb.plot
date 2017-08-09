from matplotlib import pyplot as plt
import numpy as np

# generating some data
t = np.arange(0.0, 2.0, 0.03)
s1 = 1 + np.sin(2*np.pi*t)
s2 = 1 - np.sin(2*np.pi*t)

plt.figure(figsize=[800/97, 600/97])
plt.plot(t, s1, mfc="#ffffff", marker="o");
plt.plot(t, s2, marker="o", ls="--")
plt.xlabel("Time, s")
plt.ylabel("Voltage, V")
plt.title("Simple plot with matplotlib")
plt.savefig("simple_example.svg")