from matplotlib import pyplot as plt
import numpy as np

# generating some data
t = np.arange(0.0, 2.0, 0.03)
s1 = 1 + np.sin(2*np.pi*t)
s2 = 1 - np.sin(2*np.pi*t)

plt.figure(figsize=[800/97, 600/97])
plt.scatter(t, s1, facecolors="#ffffff", edgecolors="C0");
plt.plot(t, s2, ls="--", color="C1")
plt.xlabel("Time, s")
plt.ylabel("Voltage, V")
plt.title("Simple plot with matplotlib")
plt.savefig("simple_example.svg")